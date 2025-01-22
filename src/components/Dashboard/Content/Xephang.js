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
        const response = await axiosInstance.get("v1/DanhMucDiTichXepHang/DanhSachDiTichXepHang?pageNumber=1&pageSize=20", {
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
  const handleDelete = (record) => {
    // Kiểm tra xem record.key có hợp lệ không
    if (!record.key) {
      message.error("Không thể xóa bản ghi này vì không có ID.");
      return;
    }
  
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa?',
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      onOk: async () => {
        setLoading(true);
        try {
          // Đảm bảo rằng id là một giá trị hợp lệ trước khi thực hiện yêu cầu xóa
          const response = await axiosInstance.post(`v1/DanhMucDiTichXepHang/XoaDiTichXepHang?id=${record.key}`);
          if (response.data.status === 1) {
            message.success("Xóa thành công!");
            // Cập nhật lại dataSource trong state sau khi xóa
            setDataSource((prev) => prev.filter((item) => item.key !== record.key));
          } else {
            message.error("Xóa thất bại!");
          }
        } catch (error) {
          console.error("Error deleting record:", error);
          message.error("Có lỗi xảy ra. Vui lòng thử lại!");
        } finally {
          setLoading(false);
        }
      },
      onCancel: () => {
        // Xử lý khi người dùng hủy bỏ xóa
      }
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
      let response;
  
      // Nếu đang chỉnh sửa một bản ghi (editingRecord), sẽ lấy DiTichXepHangID từ đó
      const DiTichXepHangID = editingRecord ? editingRecord.key : null;
  
      if (DiTichXepHangID) {
        // Cập nhật bản ghi hiện tại
        const payload = {
          DiTichXepHangID: DiTichXepHangID, // ID của bản ghi cần cập nhật
          TenDiTich: values.TenDiTich,
          GhiChu: values.GhiChu,
        };
        response = await axiosInstance.post(`v1/DanhMucDiTichXepHang/CapNhatDiTichXepHang`, payload);
      } else {
        // Thêm bản ghi mới
        const payload = {
          TenDiTich: values.TenDiTich,
          GhiChu: values.GhiChu,
        };
        response = await axiosInstance.post(`v1/DanhMucDiTichXepHang/ThemDiTichXepHang`, payload);
      }
  
      // Kiểm tra kết quả phản hồi từ API
      if (response.data.status === 1) {
        // Thành công
        message.success(editingRecord ? "Cập nhật thành công!" : "Thêm mới thành công!");
        window.location.reload();
  
        // Cập nhật dataSource trong state
        if (!editingRecord) {
          setDataSource((prev) => [
            ...prev,
            {
              key: response.data.DiTichXepHangID, // ID từ API trả về
              stt: prev.length + 1, // Số thứ tự
              TenDiTich: values.TenDiTich,
              GhiChu: values.GhiChu,
            },
          ]);
        } else {
          setDataSource((prev) =>
            prev.map((item) =>
              item.key === editingRecord.key
                ? { ...item, TenDiTich: values.TenDiTich, GhiChu: values.GhiChu }
                : item
            )
          );
        }
        setIsModalVisible(false);
      } else {
        // Lỗi từ API
        message.error(response.data.message || "Đã xảy ra lỗi khi lưu dữ liệu.");
      }
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
      message.error("Có lỗi xảy ra. Vui lòng thử lại!");
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
