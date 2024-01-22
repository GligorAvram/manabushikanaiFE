import { NgModule } from "@angular/core";
import { ModalService } from "./modal.service";
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [MatDialogModule],
  providers: [ModalService],
})
export class ModalModule {}
