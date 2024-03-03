import { isEqual } from "lodash-es";
import { Observable, distinctUntilChanged, filter, map } from "rxjs";
import { valueIsDefined } from "./functions";
import { ActivatedRoute } from "@angular/router";
import { takeUntilDestroy } from "ngx-reactivetoolkit";


export function ignoreConsecutiveDuplicateValues<T>(
  source$: Observable<T>,
): Observable<T> {
  return source$.pipe(
    distinctUntilChanged((previous, current) => isEqual(previous, current)),
  );
}


export function takeIfDefined<T>(
  source$: Observable<T>,
): Observable<NonNullable<T>> {
  return source$.pipe(
    filter(valueIsDefined),
    map((v) => v as NonNullable<T>),
  );
}