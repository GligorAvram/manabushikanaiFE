import { IFormModalData } from "@shared/config/constants/shared.interfaces";
import { CreateStoryWithFile } from "@writer/ui/story-create-form-modal.component";
import { AddWordToDictionaryDto } from "app/models/Api";


export interface StoryCreateFormModalData
  extends IFormModalData<CreateStoryWithFile> {
}

export interface AddWordToDictionaryFormModalData extends IFormModalData<AddWordToDictionaryDto>{}
