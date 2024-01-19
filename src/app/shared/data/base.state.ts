import { ActiveState, EntityState, Store } from "@datorama/akita";

export interface BaseState {
    success: boolean;
    loading: boolean
}

// export interface BaseEntityState<Entity> extends State<Entity>, ActiveState, BaseState {}

export interface BaseEntityState<Entity> extends BaseState{
    entities: Entity[];
    active: Entity | undefined | null;
}