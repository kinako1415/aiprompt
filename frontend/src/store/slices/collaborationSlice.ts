import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CollaborationSession,
  CollaborationParticipant,
  CollaborationEvent,
  OperationTransformData,
} from "../../types";

interface CollaborationState {
  // Active collaboration sessions
  activeSessions: Record<string, CollaborationSession>; // promptId -> session

  // Current user's collaboration state
  currentSession: {
    promptId: string | null;
    sessionId: string | null;
    isHost: boolean;
    participants: CollaborationParticipant[];
  };

  // Real-time events (temporary storage)
  pendingEvents: CollaborationEvent[];

  // WebSocket connection state
  websocket: {
    connected: boolean;
    connecting: boolean;
    error: string | null;
    reconnectAttempts: number;
  };

  // Operational Transform state for conflict resolution
  operationQueue: Array<{
    id: string;
    operation: OperationTransformData; // Delta from Quill or similar
    timestamp: string;
    applied: boolean;
  }>;
}

const initialState: CollaborationState = {
  activeSessions: {},
  currentSession: {
    promptId: null,
    sessionId: null,
    isHost: false,
    participants: [],
  },
  pendingEvents: [],
  websocket: {
    connected: false,
    connecting: false,
    error: null,
    reconnectAttempts: 0,
  },
  operationQueue: [],
};

const collaborationSlice = createSlice({
  name: "collaboration",
  initialState,
  reducers: {
    // Session management
    joinSession: (
      state: CollaborationState,
      action: PayloadAction<{
        promptId: string;
        sessionId: string;
        isHost?: boolean;
      }>
    ) => {
      const { promptId, sessionId, isHost = false } = action.payload;
      state.currentSession = {
        promptId,
        sessionId,
        isHost,
        participants: [],
      };
    },

    leaveSession: (state: CollaborationState) => {
      const { promptId } = state.currentSession;
      if (promptId) {
        delete state.activeSessions[promptId];
      }
      state.currentSession = {
        promptId: null,
        sessionId: null,
        isHost: false,
        participants: [],
      };
    },

    updateSession: (
      state: CollaborationState,
      action: PayloadAction<CollaborationSession>
    ) => {
      const session = action.payload;
      state.activeSessions[session.promptId] = session;

      if (state.currentSession.promptId === session.promptId) {
        state.currentSession.participants = session.participants;
      }
    },

    // Participant management
    addParticipant: (
      state: CollaborationState,
      action: PayloadAction<{
        promptId: string;
        participant: CollaborationParticipant;
      }>
    ) => {
      const { promptId, participant } = action.payload;
      const session = state.activeSessions[promptId];

      if (session) {
        const existingIndex = session.participants.findIndex(
          (p: CollaborationParticipant) => p.userId === participant.userId
        );
        if (existingIndex >= 0) {
          session.participants[existingIndex] = participant;
        } else {
          session.participants.push(participant);
        }
      }

      if (state.currentSession.promptId === promptId) {
        const existingIndex = state.currentSession.participants.findIndex(
          (p: CollaborationParticipant) => p.userId === participant.userId
        );
        if (existingIndex >= 0) {
          state.currentSession.participants[existingIndex] = participant;
        } else {
          state.currentSession.participants.push(participant);
        }
      }
    },

    removeParticipant: (
      state: CollaborationState,
      action: PayloadAction<{ promptId: string; userId: string }>
    ) => {
      const { promptId, userId } = action.payload;
      const session = state.activeSessions[promptId];

      if (session) {
        session.participants = session.participants.filter(
          (p: CollaborationParticipant) => p.userId !== userId
        );
      }

      if (state.currentSession.promptId === promptId) {
        state.currentSession.participants =
          state.currentSession.participants.filter(
            (p: CollaborationParticipant) => p.userId !== userId
          );
      }
    },

    updateParticipantCursor: (
      state: CollaborationState,
      action: PayloadAction<{
        promptId: string;
        userId: string;
        cursor: { line: number; column: number };
      }>
    ) => {
      const { promptId, userId, cursor } = action.payload;
      const session = state.activeSessions[promptId];

      if (session) {
        const participant = session.participants.find(
          (p: CollaborationParticipant) => p.userId === userId
        );
        if (participant) {
          participant.cursor = cursor;
          participant.lastSeen = new Date().toISOString();
        }
      }

      if (state.currentSession.promptId === promptId) {
        const participant = state.currentSession.participants.find(
          (p: CollaborationParticipant) => p.userId === userId
        );
        if (participant) {
          participant.cursor = cursor;
          participant.lastSeen = new Date().toISOString();
        }
      }
    },

    // Real-time events
    addPendingEvent: (
      state: CollaborationState,
      action: PayloadAction<CollaborationEvent>
    ) => {
      state.pendingEvents.push(action.payload);

      // Keep only last 100 events
      if (state.pendingEvents.length > 100) {
        state.pendingEvents = state.pendingEvents.slice(-100);
      }
    },

    clearPendingEvents: (state: CollaborationState) => {
      state.pendingEvents = [];
    },

    // WebSocket connection
    wsConnecting: (state: CollaborationState) => {
      state.websocket.connecting = true;
      state.websocket.error = null;
    },

    wsConnected: (state: CollaborationState) => {
      state.websocket.connected = true;
      state.websocket.connecting = false;
      state.websocket.error = null;
      state.websocket.reconnectAttempts = 0;
    },

    wsDisconnected: (
      state: CollaborationState,
      action: PayloadAction<{ error?: string }>
    ) => {
      state.websocket.connected = false;
      state.websocket.connecting = false;
      if (action.payload.error) {
        state.websocket.error = action.payload.error;
      }
    },

    wsReconnectAttempt: (state: CollaborationState) => {
      state.websocket.reconnectAttempts += 1;
      state.websocket.connecting = true;
    },

    // Operational Transform
    addOperation: (
      state: CollaborationState,
      action: PayloadAction<{
        id: string;
        operation: OperationTransformData;
        timestamp: string;
      }>
    ) => {
      state.operationQueue.push({
        ...action.payload,
        applied: false,
      });
    },

    markOperationApplied: (
      state: CollaborationState,
      action: PayloadAction<string>
    ) => {
      const operation = state.operationQueue.find(
        (op) => op.id === action.payload
      );
      if (operation) {
        operation.applied = true;
      }
    },

    clearAppliedOperations: (state: CollaborationState) => {
      state.operationQueue = state.operationQueue.filter(
        (op: {
          id: string;
          operation: OperationTransformData;
          timestamp: string;
          applied: boolean;
        }) => !op.applied
      );
    },
  },
});

export const {
  joinSession,
  leaveSession,
  updateSession,
  addParticipant,
  removeParticipant,
  updateParticipantCursor,
  addPendingEvent,
  clearPendingEvents,
  wsConnecting,
  wsConnected,
  wsDisconnected,
  wsReconnectAttempt,
  addOperation,
  markOperationApplied,
  clearAppliedOperations,
} = collaborationSlice.actions;

export default collaborationSlice.reducer;
