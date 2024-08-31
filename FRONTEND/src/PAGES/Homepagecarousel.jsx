
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';



export default function Homepagecarousel() {

     const imageUrls = [
    'https://rukminim2.flixcart.com/fk-p-flap/520/280/image/489e9d22dcf14109.jpg?q=20',

    'https://rukminim2.flixcart.com/fk-p-flap/520/280/image/40b6b96b6c162c77.jpg?q=20',
    'https://rukminim2.flixcart.com/fk-p-flap/520/280/image/0543a28cd9b7cead.jpg?q=20',
  ];

  return (
    <div>
   
   <div className="w-screen max-w-4xl mx-auto  mt-8">
      <Carousel showThumbs={false} autoPlay infiniteLoop showStatus={false}>
        {imageUrls.map((url, index) => (
          <div key={index}>
            <img src={url} alt={`Slide ${index + 1}`}
            className="w-full object-fit h-48 sm:h-64 md:h-80 lg:h-96 xl:h-144 2xl:h-160" />
         
          </div>
        ))}
      </Carousel>
    </div>
     
    </div>
  )
}
