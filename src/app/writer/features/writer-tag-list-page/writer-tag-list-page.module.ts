import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { ModalModule } from "@shared/features/modal/modal.module";
import { ButtonModule } from "@shared/ui/buttons/button.module";
import { DeleteButtonComponent } from "@shared/ui/buttons/delete-button.component";
import { PrimaryButtonComponent } from "@shared/ui/buttons/primary-button.component";
import { ContainerComponent } from "@shared/ui/container.component";
import { HeaderComponent } from "@shared/ui/header.component";
import { LoadingBarComponent } from "@shared/ui/loading-bar.component";
import { TitleComponent } from "@shared/ui/title.component";
import { WriterDataModule } from "@writer/data/writer-data.module";
import { WriterTagListPageComponent } from './writer-tag-list-page.component';
import { WriterTagListPageRoutingModule } from "./writer-tag-list-page-routing.module";

@NgModule({
  declarations: [WriterTagListPageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WriterTagListPageRoutingModule,
    WriterDataModule,
    ContainerComponent,
    LoadingBarComponent,
    HeaderComponent,
    TitleComponent,
    ButtonModule,
    PrimaryButtonComponent,
    DeleteButtonComponent,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ModalModule
  ],
})
export class WriterTagListPageModule {}
