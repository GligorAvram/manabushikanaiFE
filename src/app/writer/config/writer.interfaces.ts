import {IFormModalData} from "@shared/config/constants/shared.interfaces";
import {CreateStoryWithFiles} from "@writer/ui/story-create-form-modal.component";
import {CreateDictionaryWordDto} from "@models/Api";

export interface StoryCreateFormModalData
  extends IFormModalData<CreateStoryWithFiles> {
}


export interface CreateDictionaryWordFormModalData extends IFormModalData<CreateDictionaryWordDto> {
}
