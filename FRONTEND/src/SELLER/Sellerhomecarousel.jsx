import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import carouselimg1 from "../assets/seller1.png"
import carouselimg2 from "../assets/seller2.png"

export default function Sellerhomecarousel() {
  const imageUrls = [carouselimg1, carouselimg2]
    

  return (
    <div className=" py-8 dark:bg-gray-900">
      <div className="w-full max-w-3xl mx-auto mt-6"> {/* Smaller carousel width */}
        <Carousel showThumbs={false} autoPlay infiniteLoop showStatus={false}>
          {imageUrls.map((url, index) => (
            <div key={index}>
              <img
                src={url}
                alt={`Slide ${index + 1}`}
                className="w-full object-cover h-40 sm:h-56 md:h-72 lg:h-80 xl:h-96 rounded-lg"
              />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
