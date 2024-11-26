import { Modal, Button } from 'react-bootstrap';
import './ErrorModal.css';

function ErrorModal({ show, error, onHide }) {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{error}</p>
            </Modal.Body>
        </Modal>
    )
}

export default ErrorModal;