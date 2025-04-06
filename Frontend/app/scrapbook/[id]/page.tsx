"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useRouter } from 'next/navigation';
interface ImageItem {
  id: number;
  imageUrl: string;
  height: number;
}

const TripScrapbook = () => {
  const { tripId } = useParams();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would be fetched from your API based on tripId
    const pastTripImages: ImageItem[] = [
      { id: 1, imageUrl: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?q=80&w=2601&auto=format&fit=crop", height: 350 },
      { id: 2, imageUrl: "https://images.unsplash.com/photo-1565060169187-5284a3c323dd?q=80&w=2070&auto=format&fit=crop", height: 280 },
      { id: 3, imageUrl: "https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?q=80&w=2070&auto=format&fit=crop", height: 320 },
      { id: 4, imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop", height: 250 },
      { id: 5, imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9357976b82?q=80&w=2020&auto=format&fit=crop", height: 300 },
      { id: 6, imageUrl: "https://images.unsplash.com/photo-1550340499-a6c60feeb31c?q=80&w=2070&auto=format&fit=crop", height: 280 },
      { id: 7, imageUrl: "https://images.unsplash.com/photo-1575685554175-f5e9ad7f2fce?q=80&w=2070&auto=format&fit=crop", height: 320 },
      { id: 8, imageUrl: "https://images.unsplash.com/photo-1527576539890-dfa815648363?q=80&w=2070&auto=format&fit=crop", height: 260 },
      { id: 9, imageUrl: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?q=80&w=2070&auto=format&fit=crop", height: 290 },
      { id: 10, imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=2070&auto=format&fit=crop", height: 310 },
      { id: 11, imageUrl: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?q=80&w=2070&auto=format&fit=crop", height: 270 },
      { id: 12, imageUrl: "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?q=80&w=2070&auto=format&fit=crop", height: 340 },
      { id: 13, imageUrl: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?q=80&w=2070&auto=format&fit=crop", height: 280 },
      { id: 14, imageUrl: "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?q=80&w=2070&auto=format&fit=crop", height: 300 },
      { id: 15, imageUrl: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?q=80&w=2070&auto=format&fit=crop", height: 320 },
      { id: 16, imageUrl: "https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=2070&auto=format&fit=crop", height: 260 },
      { id: 17, imageUrl: "https://images.unsplash.com/photo-1439337153520-7082a56a81f4?q=80&w=2070&auto=format&fit=crop", height: 290 },
      { id: 18, imageUrl: "https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?q=80&w=2070&auto=format&fit=crop", height: 320 },
      { id: 19, imageUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?q=80&w=2070&auto=format&fit=crop", height: 340 },
      { id: 20, imageUrl: "https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?q=80&w=2070&auto=format&fit=crop", height: 290 },
      { id: 21, imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=3882&auto=format&fit=crop", height: 310 },
      { id: 22, imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=4896&auto=format&fit=crop", height: 270 },
      { id: 23, imageUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?q=80&w=5760&auto=format&fit=crop", height: 300 },
      { id: 24, imageUrl: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?q=80&w=3498&auto=format&fit=crop", height: 280 },
      { id: 25, imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=3634&auto=format&fit=crop", height: 320 },
      { id: 26, imageUrl: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=4000&auto=format&fit=crop", height: 350 },
      { id: 27, imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=4928&auto=format&fit=crop", height: 280 },
      { id: 28, imageUrl: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=3648&auto=format&fit=crop", height: 310 },
      { id: 29, imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=3072&auto=format&fit=crop", height: 290 },
      { id: 30, imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=3654&auto=format&fit=crop", height: 330 },
    ];

    const currentTripImages: ImageItem[] = [
      { id: 1, imageUrl: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=2070&auto=format&fit=crop", height: 300 },
      { id: 2, imageUrl: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2039&auto=format&fit=crop", height: 280 },
      { id: 3, imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2071&auto=format&fit=crop", height: 320 },
      { id: 4, imageUrl: "https://images.unsplash.com/photo-1529586691389-4adef18a2cab?q=80&w=2070&auto=format&fit=crop", height: 260 },
      { id: 5, imageUrl: "https://images.unsplash.com/photo-1551038247-3d9af20df552?q=80&w=2071&auto=format&fit=crop", height: 290 },
      { id: 6, imageUrl: "https://images.unsplash.com/photo-1524230572899-a752b3835840?q=80&w=2070&auto=format&fit=crop", height: 310 },
      { id: 7, imageUrl: "https://images.unsplash.com/photo-1433832597046-4f10e10ac764?q=80&w=2070&auto=format&fit=crop", height: 330 },
      { id: 8, imageUrl: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?q=80&w=2070&auto=format&fit=crop", height: 290 },
      { id: 9, imageUrl: "https://images.unsplash.com/photo-1466442929976-97f336a657be?q=80&w=2070&auto=format&fit=crop", height: 300 },
      { id: 10, imageUrl: "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?q=80&w=2070&auto=format&fit=crop", height: 340 },
      { id: 11, imageUrl: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?q=80&w=2070&auto=format&fit=crop", height: 280 },
      { id: 12, imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=2070&auto=format&fit=crop", height: 310 },
      { id: 13, imageUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=2070&auto=format&fit=crop", height: 270 },
      { id: 14, imageUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?q=80&w=2070&auto=format&fit=crop", height: 320 },
      { id: 15, imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=2070&auto=format&fit=crop", height: 290 },
      { id: 16, imageUrl: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?q=80&w=2070&auto=format&fit=crop", height: 300 },
      { id: 17, imageUrl: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?q=80&w=2070&auto=format&fit=crop", height: 250 },
      { id: 18, imageUrl: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?q=80&w=2070&auto=format&fit=crop", height: 280 },
      { id: 19, imageUrl: "https://images.unsplash.com/photo-1498936178812-4b2e558d2937?q=80&w=2070&auto=format&fit=crop", height: 310 },
      { id: 20, imageUrl: "https://images.unsplash.com/photo-1452960962994-acf4fd70b632?q=80&w=2070&auto=format&fit=crop", height: 290 },
      { id: 21, imageUrl: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?q=80&w=5103&auto=format&fit=crop", height: 300 },
      { id: 22, imageUrl: "https://images.unsplash.com/photo-1439886183900-e79ec0057170?q=80&w=2000&auto=format&fit=crop", height: 270 },
      { id: 23, imageUrl: "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?q=80&w=5472&auto=format&fit=crop", height: 320 },
      { id: 24, imageUrl: "https://images.unsplash.com/photo-1441057206919-63d19fac2369?q=80&w=2048&auto=format&fit=crop", height: 280 },
      { id: 25, imageUrl: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?q=80&w=5472&auto=format&fit=crop", height: 310 },
      { id: 26, imageUrl: "https://images.unsplash.com/photo-1438565434616-3ef039228b15?q=80&w=6016&auto=format&fit=crop", height: 330 },
      { id: 27, imageUrl: "https://images.unsplash.com/photo-1501286353178-1ec881214838?q=80&w=5146&auto=format&fit=crop", height: 270 },
      { id: 28, imageUrl: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?q=80&w=4752&auto=format&fit=crop", height: 300 },
      { id: 29, imageUrl: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?q=80&w=4032&auto=format&fit=crop", height: 280 },
      { id: 30, imageUrl: "https://images.unsplash.com/photo-1487252665478-49b61b47f302?q=80&w=5472&auto=format&fit=crop", height: 310 },
    ];
    
    // Set images based on trip ID
    const tripIdNumber = parseInt(tripId || '0');
    setImages(tripIdNumber <= 4 ? pastTripImages : currentTripImages);
    setLoading(false);
  }, [tripId]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-blue-800 text-xl">Loading images...</p>
      </div>
    );
  }

  const isPastTrip = parseInt(tripId || '0') <= 4;
  const title = isPastTrip ? `Past Trip ${tripId}` : `Current Trip ${parseInt(tripId || '5') - 4}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <Button 
                variant="ghost" 
                className="mb-4 md:mb-0 text-blue-700 hover:text-blue-900 hover:bg-blue-50 -ml-3"
                onClick={() => router.push('/dashboard')}
              >
                ← Back to Trips
              </Button>
            </div>
            <div className="text-center md:text-right">
              <h1 className="text-2xl md:text-3xl font-bold text-blue-800">{title}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Pinterest-style gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {images.map((image) => (
            <div 
              key={image.id} 
              className="break-inside-avoid bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div 
                className="relative"
                style={{ height: `${image.height}px` }}
              >
                <img 
                  src={image.imageUrl} 
                  alt={`Image ${image.id}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll to top button */}
      {scrolled && (
        <div className="fixed bottom-8 right-8">
          <Button 
            onClick={scrollToTop}
            className="rounded-full w-12 h-12 bg-blue-700 hover:bg-blue-800 text-white shadow-lg"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TripScrapbook;
