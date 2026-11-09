import { HttpErrorDto } from '@models/Api';

export interface BaseState {
    success: boolean;
    loading: boolean;
    error: HttpErrorDto | null;
}
