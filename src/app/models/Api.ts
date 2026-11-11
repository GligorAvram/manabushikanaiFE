/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CreateTagDto {
  /**
   * @minLength 1
   * @maxLength 2147483647
   */
  name: string;
}

export interface TagDto {
  /** @format uuid */
  id: string;
  name: string;
}

export interface ReorderCollectionDto {
  /** @minItems 1 */
  storyIds: string[];
}

export interface CollectionDto {
  /** @format uuid */
  id: string;
  name: string;
  japaneseName: string;
  description?: string;
  tags?: TagDto[];
  stories?: StoryDto[];
}

export enum StoryDifficultyEnum {
  EASIEST = "EASIEST",
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  DIFFICULT = "DIFFICULT",
  CHALLENGING = "CHALLENGING",
}

export interface StoryDto {
  /** @format uuid */
  id: string;
  name: string;
  japaneseName: string;
  description?: string;
  japaneseDescription?: string;
  storyOrigin?: string;
  published: "true" | "false";
  difficulty: StoryDifficultyEnum;
  image: string;
  tags?: TagDto[];
}

export interface CreateStoryDto {
  /**
   * @minLength 3
   * @maxLength 2147483647
   */
  name: string;
  /**
   * @minLength 1
   * @maxLength 2147483647
   */
  japaneseName: string;
  description?: string;
  storyOrigin?: string;
  japaneseDescription?: string;
  image: string;
  difficulty: StoryDifficultyEnum;
}

export interface AlternativeWritingDto {
  /** @format uuid */
  id: string;
  alternativeWriting: string;
}

export interface DictionaryWordDto {
  id: string;
  dictionaryForm: string;
  englishTranslation: string;
  kana: string;
  japaneseDefinition: string;
  isSetPhrase?: boolean;
  pitchAccent: PitchAccentEnum;
  observation?: string;
  alternativeWritings?: AlternativeWritingDto[];
}

export interface ParagraphDto {
  /** @format uuid */
  id: string;
  originalParagraph: string;
  /** @format int32 */
  orderInStory: number;
  translationDone: boolean;
  wordsDone: boolean;
  sentences?: SentenceDto[];
  /** @format uuid */
  storyId?: string;
  words?: WordDto[];
}

export enum PitchAccentEnum {
  NONE = "NONE",
  HEIBAN = "HEIBAN",
  ATAMADAKA = "ATAMADAKA",
  NAKADAKA2 = "NAKADAKA2",
  NAKADAKA3 = "NAKADAKA3",
  NAKADAKA4 = "NAKADAKA4",
  NAKADAKA5 = "NAKADAKA5",
  NAKADAKA6 = "NAKADAKA6",
  NAKADAKA7 = "NAKADAKA7",
  NAKADAKA8 = "NAKADAKA8",
  OODAKA = "OODAKA",
}

export interface SentenceDto {
  /** @format uuid */
  id: string;
  japaneseSentence: string;
  englishTranslation: string;
  /** @format uuid */
  paragraphId: string;
  /** @format int32 */
  order: number;
}

export interface WordDto {
  id: string;
  translation: DictionaryWordDto;
  /** @format int32 */
  order: number;
  originalWord: string;
  wordKanji?: string;
  wordKana: string;
  englishTranslation: string;
  observation?: string;
}

export interface CreateDictionaryWordDto {
  /** @minLength 1 */
  dictionaryWord: string;
  /** @minLength 1 */
  englishTranslation: string;
  /** @minLength 1 */
  japaneseDefinition: string;
  /** @minLength 1 */
  kana: string;
  pitchAccent: PitchAccentEnum;
  observation?: string;
  isSetPhrase?: boolean;
  alternativeWritings?: string[];
}

export interface CreateCollectionDto {
  /**
   * @minLength 3
   * @maxLength 2147483647
   */
  name: string;
  /**
   * @minLength 3
   * @maxLength 2147483647
   */
  japaneseName: string;
  description?: string;
}

export interface CreateWordTranslationDto {
  originalWord: string;
  dictionaryWordId: string;
  /**
   * @format int32
   * @min 0
   */
  order: number;
  wordKanji?: string;
  /**
   * @minLength 1
   * @maxLength 2147483647
   */
  wordKana: string;
  observation?: string;
}

export interface CreateWordTranslationForParagraphDto {
  paragraphId: string;
  /** @minItems 1 */
  words: CreateWordTranslationDto[];
}

export interface CreateParagraphTranslationDto {
  id: string;
  sentences?: CreateSentenceDto[];
}

export interface CreateSentenceDto {
  /** @minLength 1 */
  japaneseSentence: string;
  /** @minLength 1 */
  englishTranslation: string;
  /** @format int32 */
  order: number;
}

export interface PageableDto {
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  pageSize?: number;
  sort?: "ASCENDING" | "DESCENDING";
}

export interface PaginatedTagDto {
  /** @format int64 */
  totalItems?: number;
  /** @format int32 */
  currentPage?: number;
  /** @format int32 */
  totalPages?: number;
  tags?: TagDto[];
}

export interface PaginatedStoryDto {
  /** @format int64 */
  totalItems?: number;
  /** @format int32 */
  currentPage?: number;
  /** @format int32 */
  totalPages?: number;
  stories?: StoryDto[];
}

export interface PaginatedParagraphDto {
  /** @format int64 */
  totalItems?: number;
  /** @format int32 */
  currentPage?: number;
  /** @format int32 */
  totalPages?: number;
  paragraphs?: ParagraphDto[];
}

export interface PaginatedCollectionDto {
  /** @format int64 */
  totalItems?: number;
  /** @format int32 */
  currentPage?: number;
  /** @format int32 */
  totalPages?: number;
  collections?: CollectionDto[];
}

export enum SearchScopeEnum {
  STORIES = "STORIES",
  COLLECTIONS = "COLLECTIONS",
  ALL = "ALL",
}

export interface PaginatedSearchDto {
  /** @format int64 */
  totalItems?: number;
  /** @format int32 */
  currentPage?: number;
  /** @format int32 */
  totalPages?: number;
  results?: SearchResultDto[];
}

export interface SearchResultDto {
  type: SearchResultTypeEnum;
  story?: StoryDto;
  collection?: CollectionDto;
}

export enum SearchResultTypeEnum {
  STORY = "STORY",
  COLLECTION = "COLLECTION",
}

export interface HttpErrorDto {
  message: string;
  error: Record<string, string>;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://localhost:8080/api/v1";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title No title
 * @baseUrl http://localhost:8080/api/v1
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  writer = {
    /**
     * No description
     *
     * @tags writer-tag-controller
     * @name EditTag
     * @request PUT:/writer/tags/{tagId}
     */
    editTag: (tagId: string, data: CreateTagDto, params: RequestParams = {}) =>
      this.request<TagDto, any>({
        path: `/writer/tags/${tagId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-tag-controller
     * @name DeleteTag
     * @request DELETE:/writer/tags/{tagId}
     */
    deleteTag: (tagId: string, params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/writer/tags/${tagId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-collection-controller
     * @name ReorderCollectionStories
     * @request PUT:/writer/collections/{collectionId}/stories/order
     */
    reorderCollectionStories: (collectionId: string, data: ReorderCollectionDto, params: RequestParams = {}) =>
      this.request<CollectionDto, any>({
        path: `/writer/collections/${collectionId}/stories/order`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-tag-controller
     * @name GetAllTags
     * @request GET:/writer/tags
     */
    getAllTags: (
      query: {
        name?: string;
        pageable: PageableDto;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedTagDto, any>({
        path: `/writer/tags`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-tag-controller
     * @name CreateTag
     * @request POST:/writer/tags
     */
    createTag: (data: CreateTagDto, params: RequestParams = {}) =>
      this.request<TagDto, any>({
        path: `/writer/tags`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-controller
     * @name GetAllStories
     * @request GET:/writer/stories
     */
    getAllStories: (
      query: {
        published?: "true" | "false";
        /** @default false */
        uncategorized?: boolean;
        name?: string;
        difficulty?: StoryDifficultyEnum;
        pageable: PageableDto;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedStoryDto, any>({
        path: `/writer/stories`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-controller
     * @name CreateStory
     * @request POST:/writer/stories
     */
    createStory: (
      data: {
        /** @format binary */
        file: File;
        storyData: CreateStoryDto;
      },
      params: RequestParams = {},
    ) =>
      this.request<StoryDto, any>({
        path: `/writer/stories`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-tag-controller
     * @name AddTagToStory
     * @request POST:/writer/stories/{storyId}/tags
     */
    addTagToStory: (storyId: string, data: CreateTagDto, params: RequestParams = {}) =>
      this.request<TagDto[], any>({
        path: `/writer/stories/${storyId}/tags`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-controller
     * @name PublishStory
     * @request POST:/writer/stories/{id}/publish
     */
    publishStory: (id: string, params: RequestParams = {}) =>
      this.request<StoryDto, any>({
        path: `/writer/stories/${id}/publish`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-controller
     * @name GenerateWordTranslation
     * @request POST:/writer/stories/paragraphs/{id}/ai/words
     */
    generateWordTranslation: (id: string, params: RequestParams = {}) =>
      this.request<ParagraphDto, any>({
        path: `/writer/stories/paragraphs/${id}/ai/words`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-controller
     * @name GenerateSentenceTranslation
     * @request POST:/writer/stories/paragraphs/{id}/ai/sentences
     */
    generateSentenceTranslation: (id: string, params: RequestParams = {}) =>
      this.request<ParagraphDto, any>({
        path: `/writer/stories/paragraphs/${id}/ai/sentences`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-controller
     * @name CreateDictionaryWord
     * @request POST:/writer/dictionary
     */
    createDictionaryWord: (data: CreateDictionaryWordDto, params: RequestParams = {}) =>
      this.request<DictionaryWordDto, any>({
        path: `/writer/dictionary`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-collection-controller
     * @name GetAllCollections
     * @request GET:/writer/collections
     */
    getAllCollections: (
      query: {
        pageable: PageableDto;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedCollectionDto, any>({
        path: `/writer/collections`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-collection-controller
     * @name CreateCollection
     * @request POST:/writer/collections
     */
    createCollection: (data: CreateCollectionDto, params: RequestParams = {}) =>
      this.request<CollectionDto, any>({
        path: `/writer/collections`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-tag-controller
     * @name AddTagToCollection
     * @request POST:/writer/collections/{collectionId}/tags
     */
    addTagToCollection: (collectionId: string, data: CreateTagDto, params: RequestParams = {}) =>
      this.request<TagDto[], any>({
        path: `/writer/collections/${collectionId}/tags`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-collection-controller
     * @name AddStoryToCollection
     * @request POST:/writer/collections/{collectionId}/stories/{storyId}
     */
    addStoryToCollection: (collectionId: string, storyId: string, params: RequestParams = {}) =>
      this.request<CollectionDto, any>({
        path: `/writer/collections/${collectionId}/stories/${storyId}`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-collection-controller
     * @name RemoveStoryFromCollection
     * @request DELETE:/writer/collections/{collectionId}/stories/{storyId}
     */
    removeStoryFromCollection: (collectionId: string, storyId: string, params: RequestParams = {}) =>
      this.request<CollectionDto, any>({
        path: `/writer/collections/${collectionId}/stories/${storyId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-controller
     * @name CreateWordTranslationForParagraph
     * @request PATCH:/writer/stories/translations/words
     */
    createWordTranslationForParagraph: (data: CreateWordTranslationForParagraphDto, params: RequestParams = {}) =>
      this.request<ParagraphDto, any>({
        path: `/writer/stories/translations/words`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-controller
     * @name AddParagraphTranslation
     * @request PATCH:/writer/stories/translations/sentences
     */
    addParagraphTranslation: (data: CreateParagraphTranslationDto, params: RequestParams = {}) =>
      this.request<ParagraphDto, any>({
        path: `/writer/stories/translations/sentences`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-controller
     * @name GetStoryById
     * @request GET:/writer/stories/{id}
     */
    getStoryById: (id: string, params: RequestParams = {}) =>
      this.request<StoryDto, any>({
        path: `/writer/stories/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-controller
     * @name DeleteStoryById
     * @request DELETE:/writer/stories/{id}
     */
    deleteStoryById: (id: string, params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/writer/stories/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-controller
     * @name GetParagraphsForStory
     * @request GET:/writer/stories/{id}/paragraphs
     */
    getParagraphsForStory: (
      id: string,
      query: {
        dto: PageableDto;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedParagraphDto, any>({
        path: `/writer/stories/${id}/paragraphs`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-controller
     * @name GetTranslationForWord
     * @request GET:/writer/dictionary/{word}
     */
    getTranslationForWord: (word: string, params: RequestParams = {}) =>
      this.request<DictionaryWordDto[], any>({
        path: `/writer/dictionary/${word}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-collection-controller
     * @name GetCollection
     * @request GET:/writer/collections/{collectionId}
     */
    getCollection: (collectionId: string, params: RequestParams = {}) =>
      this.request<CollectionDto, any>({
        path: `/writer/collections/${collectionId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-tag-controller
     * @name RemoveTagFromStory
     * @request DELETE:/writer/stories/{storyId}/tags/{tagId}
     */
    removeTagFromStory: (storyId: string, tagId: string, params: RequestParams = {}) =>
      this.request<TagDto[], any>({
        path: `/writer/stories/${storyId}/tags/${tagId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags writer-tag-controller
     * @name RemoveTagFromCollection
     * @request DELETE:/writer/collections/{collectionId}/tags/{tagId}
     */
    removeTagFromCollection: (collectionId: string, tagId: string, params: RequestParams = {}) =>
      this.request<TagDto[], any>({
        path: `/writer/collections/${collectionId}/tags/${tagId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),
  };
  reader = {
    /**
     * No description
     *
     * @tags reader-controller
     * @name GetAllStories1
     * @request GET:/reader/stories
     */
    getAllStories1: (
      query: {
        /** @default false */
        uncategorized?: boolean;
        name?: string;
        difficulty?: StoryDifficultyEnum;
        pageable: PageableDto;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedStoryDto, any>({
        path: `/reader/stories`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags reader-controller
     * @name GetStoryById1
     * @request GET:/reader/stories/{id}
     */
    getStoryById1: (id: string, params: RequestParams = {}) =>
      this.request<StoryDto, any>({
        path: `/reader/stories/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags reader-controller
     * @name GetParagraphsForStory1
     * @request GET:/reader/stories/{id}/paragraphs
     */
    getParagraphsForStory1: (
      id: string,
      query: {
        dto: PageableDto;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedParagraphDto, any>({
        path: `/reader/stories/${id}/paragraphs`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags reader-controller
     * @name SearchByTag
     * @request GET:/reader/search
     */
    searchByTag: (
      query: {
        tag: string;
        /** @default "ALL" */
        scope?: SearchScopeEnum;
        pageable: PageableDto;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedSearchDto, any>({
        path: `/reader/search`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags reader-controller
     * @name GetTranslationForWord1
     * @request GET:/reader/dictionary/{word}
     */
    getTranslationForWord1: (word: string, params: RequestParams = {}) =>
      this.request<DictionaryWordDto[], any>({
        path: `/reader/dictionary/${word}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags reader-collection-controller
     * @name GetAllCollections1
     * @request GET:/reader/collections
     */
    getAllCollections1: (
      query: {
        pageable: PageableDto;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginatedCollectionDto, any>({
        path: `/reader/collections`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags reader-collection-controller
     * @name GetCollection1
     * @request GET:/reader/collections/{collectionId}
     */
    getCollection1: (collectionId: string, params: RequestParams = {}) =>
      this.request<CollectionDto, any>({
        path: `/reader/collections/${collectionId}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
