import {HttpClient, HttpParams} from "@angular/common/http";
import {inject} from "@angular/core";
import {catchError, map, Observable, of, tap} from "rxjs";
import {BaseStore} from "./store.models";
import {ApiResult} from "./api-result";

export class ApiService {
//   private readonly messageService = inject(MessageService);
  private readonly http = inject(HttpClient);
  private readonly store: BaseStore<any>

  constructor(
    store: BaseStore<any>
  ) {
    this.store = store;
  }

  get<Return>(
    url: string,
    successCb?: (data: Return, ...args: any[]) => any,
    ...successCbExtraArgs: any[]
  ): Observable<ApiResult<Return>> {
    this.store.onRequestInit();
    return this.handleResponse(
      this.http.get<Return>(url),
      true,
      successCb,
      successCbExtraArgs,
    );
  }

  getWithParams<Params extends HttpParams, Return>(
    url: string,
    params: Params,
    successCb?: (data: Return, ...args: any[]) => any,
    ...successCbExtraArgs: any[]
  ): Observable<ApiResult<Return>> {
    this.store.onRequestInit();
    return this.handleResponse(
      this.http.get<Return>(url, { params }),
      true,
      successCb,
      successCbExtraArgs,
    );
  }

  getFile(url: string): Observable<ApiResult<Blob>> {
    this.store.onRequestInit();
    return this.handleResponse<Blob>(
      this.http.get(url, { responseType: 'blob' }),
      true,
    );
  }

  post<Body, Return>(
    url: string,
    body: Body,
    successCb?: (data: Return, ...args: any[]) => any,
    ...successCbExtraArgs: any[]
  ): Observable<ApiResult<Return>> {
    this.store.onRequestInit();
    return this.handleResponse(
      this.http.post<Return>(url, body),
      false,
      successCb,
      successCbExtraArgs,
    );
  }

  postWithFormData<Return>(
    url: string,
    body: FormData,
    successCb?: (data: Return, ...args: any[]) => any,
    ...successCbExtraArgs: any[]
  ): Observable<ApiResult<Return>> {
    this.store.onRequestInit();
    return this.handleResponse(
      this.http.post<Return>(url, body),
      false,
      successCb,
      successCbExtraArgs,
    );
  }

  put<Body, Return>(
    url: string,
    body: Body,
    successCb?: (data: Return, ...args: any[]) => any,
    ...successCbExtraArgs: any[]
  ): Observable<ApiResult<Return>> {
    this.store.onRequestInit();
    return this.handleResponse(
      this.http.put<Return>(url, body),
      false,
      successCb,
      successCbExtraArgs,
    );
  }

  patch<Body, Return>(
    url: string,
    body: Body,
    successCb?: (data: Return, ...args: any[]) => any,
    ...successCbExtraArgs: any[]
  ): Observable<ApiResult<Return>> {
    this.store.onRequestInit();
    return this.handleResponse(
      this.http.patch<Return>(url, body),
      false,
      successCb,
      successCbExtraArgs,
    );
  }

  delete<Return>(
    url: string,
    successCb?: (data: Return, ...args: any[]) => any,
    ...successCbExtraArgs: any[]
  ): Observable<ApiResult<Return>> {
    this.store.onRequestInit();
    return this.handleResponse(
      this.http.delete<Return>(url),
      false,
      successCb,
      successCbExtraArgs,
    );
  }

  private handleResponse<Return>(
    response: Observable<Return>,
    fromGETRequest: boolean,
    successCb?: (data: Return, ...args: any[]) => any,
    ...successCbExtraArgs: any[]
  ): Observable<ApiResult<Return>> {
    return response.pipe(
      tap(() => this.store.onSuccess(fromGETRequest)),
      map((data: Return) => new ApiResult({ data })),
      tap((result: ApiResult<Return>) => {
        if (successCb) {
          successCb(result.data!, ...successCbExtraArgs);
        }

        setTimeout(() => this.store.resetBaseState(), 200);
      }),
      catchError((err) => this.handleError<Return>(err)),
    );
  }

  private handleError<Return>(error: any): Observable<ApiResult<Return>> {
    if (Error(error)) {
      this.store.onError(error);
      //todo
    //   this.messageService.error(error);
    } else {
      this.store.setLoading(false);
      console.error(error);
    }

    return of(new ApiResult<Return>({ error }));
  }
}
