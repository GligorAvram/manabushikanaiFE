import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CreateStoryDto, StoryDto } from "app/models/Api";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class WriterApiService {
  constructor(private http: HttpClient) {}

  apiUrl = 'http://localhost:8080';

  getAllStories(params?: object): Observable<StoryDto[]> {
    return this.http.get<StoryDto[]>(`${this.apiUrl}/stories`);
  }

  getStoryById(id: string): Observable<StoryDto> {
    return this.http.get<StoryDto>(`${this.apiUrl}/stories/${id}`);
  }

  createStory(story: CreateStoryDto){
    this.http.post<StoryDto>(`${this.apiUrl}/stories`, story)
  }
}