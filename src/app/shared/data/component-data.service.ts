import { takeUntilDestroy } from 'ngx-reactivetoolkit';
import {
  Observable,
  BehaviorSubject,
  firstValueFrom,
  of,
  combineLatest,
} from 'rxjs';
import { BaseEntityQuery, BaseQuery } from './base.query';
import { takeIfDefined } from '@shared/rxjs-operators';
import { ComponentInstance } from '@shared/types';
import { BaseEntityState } from './base.state';

type BaseComponentData = { loading: boolean; success: boolean };
export type ComponentDataSource<Data extends object> = {
  [Property in keyof Data]: Observable<Data[Property]>;
};

type FullComponentData<ComponentData extends object, ExtraComponentData extends object> = BaseComponentData & ComponentData & ExtraComponentData;

export interface ListComponentData<E extends object> {
  entities: E[];
}

export interface DetailsComponentData<E> {
  entity: E;
}

export abstract class BaseComponentDataService<
  ComponentData extends object,
  ExtraComponentData extends object = {},
> {
  data$: BehaviorSubject<FullComponentData<
    ComponentData,
    ExtraComponentData
  > | null>;
  source?: ComponentDataSource<
    FullComponentData<ComponentData, ExtraComponentData>
  >;

  protected componentInstance?: ComponentInstance;
  protected readonly query?: BaseQuery<any>;

  protected constructor(query?: BaseQuery<any>) {
    this.query = query;
    this.data$ = new BehaviorSubject<FullComponentData<
      ComponentData,
      ExtraComponentData
    > | null>(null);
  }

  init(componentInstance: ComponentInstance): void {
    this.componentInstance = componentInstance;
    this.setData();
    this.onInit();
  }

  get dataAsPromise(): Promise<
    FullComponentData<ComponentData, ExtraComponentData>
  > {
    return firstValueFrom(this.data$.pipe(takeIfDefined));
  }

  protected abstract onInit(): void;

  protected abstract dataSource(): ComponentDataSource<ComponentData>;

  protected extraDataSource(): ComponentDataSource<ExtraComponentData> {
    return {} as ComponentDataSource<ExtraComponentData>;
  }

  private setData(): void {
    const dataSource = this.dataSource();
    const extraDataSource = this.extraDataSource();
    const loading = this.query?.selectLoading() ?? of(false);
    const success = this.query?.selectSuccess() ?? of(false);

    const sources = [
      ...Object.values(dataSource),
      ...Object.values(extraDataSource),
      loading,
      success,
    ];
    const keys = [
      ...Object.keys(dataSource),
      ...Object.keys(extraDataSource),
      'loading',
      'success',
    ];
    
    combineLatest(sources)
      .pipe(takeUntilDestroy(this.componentInstance))
      .subscribe((values) => {
        const data: any = {};
        values.forEach((val, idx) => (data[keys[idx]] = val));
        this.data$.next(
          data as FullComponentData<ComponentData, ExtraComponentData>,
        );
      });

    this.source = {
      ...dataSource,
      ...extraDataSource,
      loading,
      success,
    } as ComponentDataSource<
      FullComponentData<ComponentData, ExtraComponentData>
    >;
  }
}

export abstract class EntityListComponentDataService<E extends object, D extends object, S extends BaseEntityState<E>> extends BaseComponentDataService<D, ListComponentData<E>> {
  protected constructor(query: BaseEntityQuery<E, S>) {
    super(query);
  }

  protected override extraDataSource(): ComponentDataSource<ListComponentData<E>> {
    const entities = this.entityQuery.select("entities");
    return { entities: entities.pipe(takeIfDefined) };
  }

  private get entityQuery(): BaseEntityQuery<E, S> {
    return this.query as BaseEntityQuery<E, S>;
  }
}


export abstract class EntityDetailsComponentDataService<E, Data extends object> extends BaseComponentDataService<Data, DetailsComponentData<E>> {

  protected constructor(query: BaseEntityQuery<E, any> ) {
    super(query);
  }

  get entity$(): Observable<E> {
    return this.extraDataSource().entity;
  }

  get entity(): Promise<E> {
    return this.dataAsPromise.then((data) => data.entity);
  }

  protected override extraDataSource(): ComponentDataSource<DetailsComponentData<E>> {
    //todo check why the exclamation mark is needed
    const entity = this.query!.select('active');
    return { entity: entity.pipe(takeIfDefined) };
  }
}