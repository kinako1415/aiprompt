import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../index";

// テンプレート関連の型定義
export interface PromptTemplate {
  id?: string;
  name: string;
  description?: string;
  content: string;
  category?: string;
  tags?: string[];
  variables: PromptVariable[];
  metadata?: {
    category?: string;
    tags?: string[];
    [key: string]: string | string[] | number | boolean | undefined;
  };
  // 統計情報
  usageCount?: number;
  rating?: number;
  ratingCount?: number;
  // 作成・更新日時
  createdAt?: string;
  updatedAt?: string;
  // 作成者情報
  authorId?: string;
  authorName?: string;
}

export interface PromptVariable {
  name: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  description?: string;
  required?: boolean;
  defaultValue?: string;
  options?: string[]; // select型の場合の選択肢
}

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  content: string;
  category?: string;
  tags?: string[];
  variables: PromptVariable[];
  metadata?: Record<string, string | string[] | number | boolean>;
}

export interface UpdateTemplateRequest {
  name?: string;
  description?: string;
  content?: string;
  category?: string;
  tags?: string[];
  variables?: PromptVariable[];
  metadata?: Record<string, string | string[] | number | boolean>;
}

export interface TemplateFilter {
  category?: string;
  tags?: string[];
  visibility?: 'private' | 'public' | 'shared';
  search?: string;
}

export interface GenerateFromTemplateRequest {
  templateId: string;
  variables: Record<string, string | number | boolean>;
  saveAsPrompt?: boolean;
  promptTitle?: string;
  promptDescription?: string;
}

export interface GenerateFromTemplateResponse {
  content: string;
  promptId?: string; // saveAsPromptがtrueの場合
  preview?: string;
}

export const templateApi = createApi({
  reducerPath: "templateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/templates/",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.user.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Template"],
  endpoints: (builder) => ({
    // テンプレート一覧取得
    getTemplates: builder.query<
      { templates: PromptTemplate[]; total: number },
      { filters?: TemplateFilter; page?: number; limit?: number }
    >({
      query: ({ filters, page = 1, limit = 20 }) => ({
        url: "",
        params: { ...filters, page, limit },
      }),
      providesTags: ["Template"],
    }),

    // 単一テンプレート取得
    getTemplate: builder.query<PromptTemplate, string>({
      query: (id) => `${id}`,
      providesTags: (result, error, id) => [{ type: "Template", id }],
    }),

    // テンプレート作成
    createTemplate: builder.mutation<PromptTemplate, CreateTemplateRequest>({
      query: (newTemplate) => ({
        url: "",
        method: "POST",
        body: newTemplate,
      }),
      invalidatesTags: ["Template"],
    }),

    // テンプレート更新
    updateTemplate: builder.mutation<
      PromptTemplate,
      { id: string; updates: UpdateTemplateRequest }
    >({
      query: ({ id, updates }) => ({
        url: `${id}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Template", id }],
    }),

    // テンプレート削除
    deleteTemplate: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Template", id }],
    }),

    // テンプレートからプロンプト生成
    generateFromTemplate: builder.mutation<
      GenerateFromTemplateResponse,
      GenerateFromTemplateRequest
    >({
      query: ({ templateId, ...body }) => ({
        url: `${templateId}/generate`,
        method: "POST",
        body,
      }),
    }),

    // 変数自動抽出
    extractVariables: builder.mutation<
      { variables: PromptVariable[]; suggestedTemplate: string },
      { content: string }
    >({
      query: ({ content }) => ({
        url: "extract-variables",
        method: "POST",
        body: { content },
      }),
    }),

    // 人気テンプレート取得
    getPopularTemplates: builder.query<PromptTemplate[], number>({
      query: (limit = 10) => `popular?limit=${limit}`,
      providesTags: ["Template"],
    }),

    // ユーザーのテンプレート取得
    getUserTemplates: builder.query<
      { templates: PromptTemplate[]; total: number },
      { userId?: string; page?: number; limit?: number }
    >({
      query: ({ userId, page = 1, limit = 20 }) => ({
        url: userId ? `user/${userId}` : "my",
        params: { page, limit },
      }),
      providesTags: ["Template"],
    }),
  }),
});

export const {
  useGetTemplatesQuery,
  useGetTemplateQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
  useGenerateFromTemplateMutation,
  useExtractVariablesMutation,
  useGetPopularTemplatesQuery,
  useGetUserTemplatesQuery,
} = templateApi;
