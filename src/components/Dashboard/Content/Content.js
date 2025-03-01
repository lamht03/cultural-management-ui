import React from 'react';
import imageSrc from '../../../assets/img/z6360018199423_c3e83ec9f1f3ded7c8bafb0135d27a8e.jpg';
const contentStyle = {
  width: '100%',
  textAlign: 'center',
  height: '800px',
  color: '#fff',
  backgroundColor: '#fff',
  borderRadius: '20px', // Bo góc phần div chứa ảnh
  border: '1px solid #ccc',
  overflow: 'hidden', // Đảm bảo ảnh không tràn ra ngoài khi bo góc
};

const imgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '20px', // Bo góc ảnh
};

const Content = () => {
  return (
    <div style={contentStyle}>
      <img src={imageSrc} alt="Ảnh" style={imgStyle} />
    </div>
  );
};

export default Content;
