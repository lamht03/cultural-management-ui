import React from 'react';
// Sử dụng require để đảm bảo đường dẫn chính xác
const imageSrc = require('../../../assets/img/z6437607220714_b17d1a37815351c4c87c1f5a70ee435e.jpg');

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