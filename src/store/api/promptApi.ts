import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Prompt, PromptFilter, CreatePromptRequest, UpdatePromptRequest, ABTest } from '../../types'
import type { RootState } from '../index'

export const promptApi = createApi({
  reducerPath: 'promptApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
    prepareHeaders: (headers, { getState }) => {
      // Add auth token if available
      const state = getState() as RootState
      const token = state.user.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Prompt', 'Category', 'Tag'],
  endpoints: (builder) => ({
    // Get prompts with filtering and pagination
    getPrompts: builder.query<
      { prompts: Prompt[]; total: number },
      { filters?: PromptFilter; page?: number; limit?: number }
    >({
      query: ({ filters, page = 1, limit = 20 }) => ({
        url: 'prompts',
        params: { ...filters, page, limit },
      }),
      providesTags: ['Prompt'],
    }),

    // Get single prompt
    getPrompt: builder.query<Prompt, string>({
      query: (id) => `prompts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Prompt', id }],
    }),

    // Create new prompt
    createPrompt: builder.mutation<Prompt, CreatePromptRequest>({
      query: (newPrompt) => ({
        url: 'prompts',
        method: 'POST',
        body: newPrompt,
      }),
      invalidatesTags: ['Prompt'],
    }),

    // Update prompt
    updatePrompt: builder.mutation<Prompt, { id: string; updates: UpdatePromptRequest }>({
      query: ({ id, updates }) => ({
        url: `prompts/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Prompt', id }],
    }),

    // Delete prompt
    deletePrompt: builder.mutation<void, string>({
      query: (id) => ({
        url: `prompts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Prompt'],
    }),

    // Search prompts
    searchPrompts: builder.query<Prompt[], string>({
      query: (searchTerm) => ({
        url: 'prompts/search',
        params: { q: searchTerm },
      }),
      providesTags: ['Prompt'],
    }),

    // Get prompt suggestions (AI-powered)
    getPromptSuggestions: builder.query<string[], string>({
      query: (promptContent) => ({
        url: 'prompts/suggestions',
        method: 'POST',
        body: { content: promptContent },
      }),
    }),

    // A/B test endpoints
    createABTest: builder.mutation<ABTest, { promptIds: string[]; testName: string }>({
      query: (testData) => ({
        url: 'prompts/ab-test',
        method: 'POST',
        body: testData,
      }),
    }),

    // Real-time collaboration endpoints will be handled via WebSocket
    // but we can cache the latest state here
  }),
})

export const {
  useGetPromptsQuery,
  useGetPromptQuery,
  useCreatePromptMutation,
  useUpdatePromptMutation,
  useDeletePromptMutation,
  useSearchPromptsQuery,
  useLazyGetPromptSuggestionsQuery,
  useCreateABTestMutation,
} = promptApi
