import { IFormModalData } from "@shared/config/constants/shared.interfaces";
import { CreateStoryDto } from "app/models/Api";

export interface StoryCreateFormModalData
  extends IFormModalData<CreateStoryDto> {
}
