import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-upload-image',
  imports: [CommonModule,MatButtonModule,MatIconModule],
  templateUrl: './upload-image.html',
  styleUrl: './upload-image.css',
})
export class UploadImage {

  imagesPreview: string[] = [];
  imagesFiles: File[] = [];

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files).slice(0, 5);

    this.imagesPreview = [];
    this.imagesFiles = [];

    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;

      // 👉 pour affichage
      const url = URL.createObjectURL(file);
      this.imagesPreview.push(url);

      // 👉 pour backend
      this.imagesFiles.push(file);
    });
      console.log(this.imagesFiles)
    input.value = '';
  }
}
