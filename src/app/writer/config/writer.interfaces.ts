import { IFormModalData } from "@shared/config/constants/shared.interfaces";
import { CreateStoryWithFile } from "@writer/ui/story-create-form-modal.component";
import { CreateDictionaryWordDto } from 'app/models/Api';


export interface StoryCreateFormModalData
  extends IFormModalData<CreateStoryWithFile> {
}

export interface AddWordToDictionaryFormModalData
  extends IFormModalData<CreateDictionaryWordDto> {}
