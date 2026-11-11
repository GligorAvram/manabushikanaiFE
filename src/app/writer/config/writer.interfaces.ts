import {IFormModalData} from "@shared/config/constants/shared.interfaces";
import {CreateStoryWithFiles} from "@writer/ui/story-create-form-modal.component";
import {CreateCollectionDto, CreateDictionaryWordDto, StoryDto} from "@models/Api";
import {Observable} from "rxjs";

export interface AddStoryToCollectionFormData {
  storyId: string;
}

export interface StoryCreateFormModalData
  extends IFormModalData<CreateStoryWithFiles> {
}


export interface CreateDictionaryWordFormModalData extends IFormModalData<CreateDictionaryWordDto> {
}


export interface CollectionCreateFormModalData extends IFormModalData<CreateCollectionDto> {
}


export interface AddStoryToCollectionFormModalData
  extends IFormModalData<AddStoryToCollectionFormData> {
  stories$: Observable<StoryDto[]>;
}
