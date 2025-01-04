import {IFormModalData} from "@shared/config/constants/shared.interfaces";
import {CreateStoryWithFile} from "@writer/ui/story-create-form-modal.component";
import {CreateDictionaryWordDto} from "@models/Api";

export interface StoryCreateFormModalData
  extends IFormModalData<CreateStoryWithFile> {
}


export interface CreateDictionaryWordFormModalData extends IFormModalData<CreateDictionaryWordDto> {
}
