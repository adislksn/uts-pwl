import { Table, Stack, Modal, Button, Navbar, Container, Form } from "react-bootstrap";
import { useState, useEffect, useCallback } from "react";
import serviceProduct from "../services/product";

function Product() {
    const [show, setShow] = useState(false);
    const [id, setId] = useState(0);
    const [namaProduk, setNamaProduk] = useState("");
    const [dataProduk, setDataProduk] = useState([]);
    const [tempDataEdit, setTempDataEdit] = useState({
        nama_produk: "",
        detail_produk: "",
        harga_produk: 0,
        stok: 0
    });
    const handleEditChange = async (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setTempDataEdit({
            ...tempDataEdit,
            [name]: value
        });
    };
    const { nama_produk, detail_produk, harga_produk, stok } = tempDataEdit;

    const handleCloseDelete = () => {
      setShow(false);
      setId(0);
      setNamaProduk("");
    };

    const handleCloseEdit = () => {
        setShow(false);
        setId(0);
        setTempDataEdit({
          nama_produk: "",
          detail_produk: "",
          harga_produk: 0,
          stok: 0
      });
    };

    const openHandleDelete = (id, namaProduk) => {
        setShow(true);
        setId(id);
        setNamaProduk(namaProduk);
    }

    const openHandleEdit = (id) => {
        setShow(true);
        setId(id);
        getDetailProduct(id);
    }

    const deleteProduct = async (id) => {
        try{
            const res = await serviceProduct.deleteProduct(id)
            handleCloseDelete()
            getProducts()
            return console.log(res)
        }
        catch (err) {
            console.log(err)
        }
    }
    const getProducts = useCallback(async () => {
        try{
            const res = await serviceProduct.getProducts()
            setDataProduk(res.data)
            return console.log(res)
          }
        catch (err) {
            console.log(err)
        }
    }, []);

    const getDetailProduct = useCallback(async (id) => {
        try{
            const res = await serviceProduct.getDetailProduct(id)
            setTempDataEdit({
                nama_produk: res.data.product_name,
                detail_produk: res.data.product_detail,
                harga_produk: res.data.product_price,
                stok: res.data.supply
            })
            return console.log(res)
          }
        catch (err) {
            console.log(err)
        }
    }, []);

    const updateProduct = async (id, data) => {
        try{
            const res = await serviceProduct.updateProduct(id, data)
            handleCloseEdit()
            getProducts()
            return console.log(res)
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getProducts()
    }, [getProducts]);

  return (
    <div>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Pyramid + Vite + React</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Signed in as: <a href="#login">Admin</a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="pt-5 px-5">
        <Table striped bordered hover>
          <thead className="text-center">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nama Produk</th>
              <th scope="col">Harga Produk</th>
              <th scope="col">Jumlah Stok</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {dataProduk.map((item, index) => {
                  return (
                      <tr key={index} className="align-items-center">
                          <th scope="row">{index + 1}</th>
                          <td>{item.nama_produk}</td>
                          <td>{item.harga_produk}</td>
                          <td>{item.stok}</td>
                          <td className="justify-content-center d-flex">
                              <Stack direction="horizontal" gap={2}>
                                  <Button variant="warning" onClick={() => openHandleEdit(item.id)}>
                                      Lihat & Edit
                                  </Button>
                                  <Button variant="danger" onClick={() => openHandleDelete(item.id, item.nama_produk)}>
                                      Delete
                                  </Button>
                              </Stack>
                          </td>
                      </tr>
                  )
              }
              )}
          </tbody>
        </Table>
      </div>

      <Modal show={show} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Menghapus Produk</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah anda yakin menghapus produk {namaProduk} ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Close
          </Button>
          <Button variant="danger" onClick={() => deleteProduct(id)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Produk</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => updateProduct(id, e.target)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Nama Produk</Form.Label>
                <Form.Control type="text" name="nama_produk" value={nama_produk} onChange={handleEditChange} placeholder="Nama Produk" />

                <Form.Label>Detail Produk</Form.Label>
                <Form.Control type="text" name="detail_produk" value={detail_produk} onChange={handleEditChange} placeholder="Detail Produk" />

                <Form.Label>Harga Produk</Form.Label>
                <Form.Control type="number" name="harga_produk" value={harga_produk} onChange={handleEditChange} placeholder="Harga Produk" />

                <Form.Label>Jumlah Stok</Form.Label>
                <Form.Control type="number" name="stok" value={stok} onChange={handleEditChange} placeholder="Jumlah Stok" />
            </Form.Group>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseEdit}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Update
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default Product;
