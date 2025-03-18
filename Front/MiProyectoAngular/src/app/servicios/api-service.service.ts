import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private GIPHY_API_KEY = 'rlShRRspdjORRqdY1CVIsqXh7XtPCnh5';
  private YOUTUBE_API_KEY = 'AIzaSyDpTlob93aIoz3TF760crW6RKkr5IgVcTo';

  constructor(private http: HttpClient) {}

  getGiphyGif(searchTerm: string): Observable<any> {
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${this.GIPHY_API_KEY}&q=${encodeURIComponent(searchTerm)}&limit=1`;
    return this.http.get<any>(url);
  }

  getYoutubeVideo(searchTerm: string): Observable<any> {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchTerm)}&key=${this.YOUTUBE_API_KEY}&type=video&maxResults=1`;
    return this.http.get<any>(url);
  }
}
