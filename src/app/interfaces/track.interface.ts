export interface ITrack {
    track_id: string;             
    track_name: string;           
    artist_name: string[];
    year: number;                 
    popularity: number;           
    artwork_url: string;          
    album_name: string;           
    acousticness: number;         
    danceability: number;         
    duration_ms: number;          
    energy: number;               
    instrumentalness: number;     
    key: number;                  
    liveness: number;             
    loudness: number;             
    mode: number;                 
    speechiness: number;          
    tempo: number;                
    time_signature: number;       
    valence: number;              
    track_url: string;            
    language: string;             
    featuring: boolean;            
    genres: string[];
  }