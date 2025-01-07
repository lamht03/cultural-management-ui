import React, { useState, useEffect } from "react";
import { Button, Layout, Table, Input, Modal, Form,message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "../../../assets/css/Nguoidung.css";
import axiosInstance from "../../../utils/axiosInstance";
const { Content } = Layout;
const { Search } = Input;
const columns = (onEdit, onDelete) => [
  {
    title: "Số thứ tự",
    dataIndex: "stt",
    key: "stt",
    align: "center",
  },
  {
    title: "Tên cấp di tích xếp hạng	",
    dataIndex: "TenDiTich",
    key: "TenDiTich",
    align: "left",
  },
  {
    title: "Thứ tự hiển thị	",
    dataIndex: "GhiChu",
    key: "GhiChu",
    align: "left",
  },
  {
    title: "Thao tác",
    key: "actions",
    align: "center",
    render: (_, record) => (
      <span className="action-icons">
        <Button
          type="link"
          style={{ color: "black", fontSize: "20px" }}
          onClick={() => onEdit(record)}
        >
          <EditOutlined />
        </Button>
        <Button
          type="link"
          style={{ color: "black", fontSize: "20px" }}
          danger
          onClick={() => onDelete(record)}
        >
          <DeleteOutlined />
        </Button>
      </span>
    ),
  },
];
const contentStyle = {
  width: "100%",
  height: "800px",
  color: "#000",
  backgroundColor: "#fff",
  borderRadius: 1,
  border: "1px solid #ccc",
  padding: "20px",
};
const Nguoidung = () => {
  const [searchName, setSearchName] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/DanhMucDiTichXepHang/List?pageNumber=1&pageSize=20", {
          params: { pageNumber: 1, pageSize: 20 },
        });
        if (response.data && Array.isArray(response.data.Data)) {
          const formattedData = response.data.Data.map((item, index) => ({
            key: item.DiTichXepHangID,
            stt: index + 1,
            TenDiTich: item.TenDiTich || "Chưa có tên",
            GhiChu: item.GhiChu || "Không có ghi chú",
          }));
          setDataSource(formattedData);
        } else {
          console.error("Invalid response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const onSearch = (value) => {
    setSearchName(value);
  };
  const filteredData = dataSource.filter((item) =>
    item.TenDiTich.toLowerCase().includes(searchName.toLowerCase())
  );
  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      TenDiTich: record.TenDiTich,
      GhiChu: record.GhiChu,
    });
    setIsModalVisible(true);
  };
  const handleDelete = async (record) => {
    Modal.confirm({
      title: "Xóa bản ghi",
      content: `Bạn có muốn xóa bản ghi không?`,
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          // Thêm ID trực tiếp vào URL dưới dạng tham số truy vấn
          const response = await axiosInstance.post(
            `/DanhMucDiTichXepHang/Delete?id=${record.key}`
          );
          if (response?.data?.status === 1) {
            // Cập nhật dataSource bằng cách loại bỏ phần tử đã bị xóa
            setDataSource((prev) =>
              prev.filter((item) => item.key !== record.key)
            );
            message.success("Xóa thành công!");
          } else {
            message.error(`Xóa thất bại: ${response.data.message}`);
          }
        } catch (error) {
          console.error("Lỗi khi xóa bản ghi:", error);
          message.error("Đã xảy ra lỗi khi xóa bản ghi.");
        }
      },
    });
  };
  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };
  const handleModalOk = async () => {
    try {
      const values = form.getFieldsValue(); // Lấy dữ liệu từ form
      if (editingRecord) {
        // Cập nhật bản ghi hiện tại
        const payload = {
          DiTichXepHangID: editingRecord.key, // ID của bản ghi cần cập nhật
          TenDiTich: values.TenDiTich,
          GhiChu: values.GhiChu,
        };
        await axiosInstance.post(`/DanhMucDiTichXepHang/Update`, payload);
        // Cập nhật dataSource trong state
        setDataSource((prev) =>
          prev.map((item) =>
            item.key === editingRecord.key
              ? { ...item, TenDiTich: values.TenDiTich, GhiChu: values.GhiChu }
              : item
          )
        );
      } else {
        // Thêm bản ghi mới
        const payload = {
          TenDiTich: values.TenDiTich,
          GhiChu: values.GhiChu,
        };
        const response = await axiosInstance.post(
          `/DanhMucDiTichXepHang/Insert`,
          payload
        );
        // Cập nhật dataSource trong state
        setDataSource((prev) => [
          ...prev,
          {
            key: response.data.DiTichXepHangID, // ID từ API trả về
            stt: prev.length + 1, // Số thứ tự
            TenDiTich: values.TenDiTich,
            GhiChu: values.GhiChu,
          },
        ]);
      }
      // Đóng modal sau khi xử lý xong
      setIsModalVisible(false);
      message.success(editingRecord ? "Cập nhật thành công!" : "Thêm mới thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
      message.error("Đã xảy ra lỗi khi lưu dữ liệu.");
    }
  };
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };
  return (
      <Content style={contentStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1 style={{ fontSize: 19 }}>DANH MỤC CẤP DI TÍCH XẾP HẠNG
          </h1>
          <Button type="primary" onClick={handleAdd}>
            Thêm
          </Button>
        </div>
        <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
          <Search
            placeholder="Tìm kiếm theo tên kỳ báo cáo"
            allowClear
            value={searchName}
            onSearch={onSearch}
            onChange={(e) => setSearchName(e.target.value)}
            style={{ width: 200 }}
          />
        </div>
        <Table
          className="custom-table"
          dataSource={filteredData}
          columns={columns(handleEdit, handleDelete)}
          pagination={{ pageSize: 5 }}
          loading={loading}
        />
        <Modal
          title={editingRecord ? "Sửa kỳ báo cáo" : "Thêm kỳ báo cáo"}
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Tên kỳ báo cáo"
              name="TenDiTich"
              rules={[{ required: true, message: "Vui lòng nhập tên kỳ báo cáo" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Ghi chú"
              name="GhiChu"
              rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Content>  
  );
};
export default Nguoidung;
