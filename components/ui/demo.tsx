"use client";

import MusicArtwork from './music-artwork';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4 relative overflow-hidden">
      <div className="text-center space-y-12 relative z-10">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-center">
              <MusicArtwork
                artist="Drake"
                music="Search & Rescue"
                albumArt="https://a5.mzstatic.com/us/r1000/0/Music116/v4/f9/6d/dc/f96ddc30-396d-6dbb-86fe-399831a26446/23UMGIM39822.rgb.jpg"
                isSong={true}
                isLoading={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
