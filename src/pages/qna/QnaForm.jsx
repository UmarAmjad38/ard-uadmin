import { useState, useEffect } from 'react';
import { qnaAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';

const QnaForm = ({ qna, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (qna) {
      setFormData({
        question: qna.question || '',
        answer: qna.answer || '',
      });
    }
  }, [qna]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (qna) {
        await qnaAPI.update(qna._id, formData);
        toast.success('QnA updated successfully');
      } else {
        await qnaAPI.create(formData);
        toast.success('QnA created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving QnA:', error);
      toast.error(error.response?.data?.message || 'Failed to save QnA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={qna ? 'Edit QnA' : 'Add QnA'} size="lg">
      <form onSubmit={handleSubmit}>
        <Input
          label="Question"
          name="question"
          value={formData.question}
          onChange={handleChange}
          required
          placeholder="Enter the question here..."
        />

        <Textarea
          label="Answer"
          name="answer"
          value={formData.answer}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Enter the detailed answer here..."
        />

        <div className="flex justify-end gap-3 mt-8">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {qna ? 'Update QnA' : 'Save QnA'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default QnaForm;
