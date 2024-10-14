import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Import Swiper styles
import { Autoplay, Pagination, Navigation } from 'swiper/modules'; // Import Swiper modules

// Use MUI v5 styled components instead of makeStyles if you've upgraded
import { styled } from '@mui/material/styles';

// Define a styled component using MUI v5
const StyledSwiperContainer = styled('div')(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  height: '300px', // Adjust height as needed
  width: '100%',
}));

export default function Carousel() {
  return (
    <StyledSwiperContainer>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]} // Use the module configuration here
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
      >
        <SwiperSlide>
          <img src="https://plus.unsplash.com/premium_photo-1664300897489-fd98eee64faf?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGlicmFyeXxlbnwwfHwwfHx8MA%3D%3D" alt="Slide 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://media.istockphoto.com/id/1699271970/photo/latin-student-studying-using-laptop-learning-language-exam-preparation-sitting-in-library.webp?b=1&s=612x612&w=0&k=20&c=oq32IYFyjBN-sJ4dBHghDICVAE84g7DKKezDyZ-cFZs=" alt="Slide 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://media.istockphoto.com/id/135341581/photo/old-books-in-a-library-big-file.jpg?s=612x612&w=0&k=20&c=mahB12CP-VHRYQYNLV0ZQ8CTtHbIWY2qpWlQaZNUgy8=" alt="Slide 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://media.istockphoto.com/id/1498878143/photo/book-stack-and-open-book-on-the-desk-in-modern-public-library.webp?b=1&s=612x612&w=0&k=20&c=VNyPBKIS8zq_58gLSa3fnpHq1DRVvjdZHzW4fGPcIb8=" alt="Slide 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </SwiperSlide>
      </Swiper>
    </StyledSwiperContainer>
  );
}
