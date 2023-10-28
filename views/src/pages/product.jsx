import { Table, Stack, Modal, Button } from "react-bootstrap";
import { useState, useEffect, useCallback } from "react";
import serviceProduct from "../services/product";

function Product() {
    const [show, setShow] = useState(false);
    const [id, setId] = useState(0);
    const [namaProduk, setNamaProduk] = useState("");
    const [dataProduk, setDataProduk] = useState([]);

    const handleCloseDelete = () => {
      setShow(false);
      setId(0);
      setNamaProduk("");
    };

    const openHandle = (id, namaProduk) => {
        setShow(true);
        setId(id);
        setNamaProduk(namaProduk);
    }
    const deleteProduct = async (id) => {
        try{
            const res = await serviceProduct.deleteProduct(id)
            handleCloseDelete()
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

    useEffect(() => {
        getProducts()
    }, [getProducts]);

  return (
    <div>
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
                        <td>
                            <Stack direction="horizontal" gap={2}>
                                <Button variant="primary" onClick={() => openHandle(item.id, item.nama_produk)}>
                                    Lihat
                                </Button>
                                <Button variant="warning" onClick={() => openHandle(item.id, item.nama_produk)}>
                                    Edit
                                </Button>
                                <Button variant="danger" onClick={() => openHandle(item.id, item.nama_produk)}>
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

      <Modal show={show} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Menghapus Produk</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah anda yakin menghapus produk {namaProduk} ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Close
          </Button>
          <button type="button" className="btn btn-danger" onClick={() => deleteProduct(id)}>
                Delete
            </button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default Product;
