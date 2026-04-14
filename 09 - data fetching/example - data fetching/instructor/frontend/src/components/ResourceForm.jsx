import { useState } from 'react';
import { Form, useNavigate } from 'react-router';

export default function ResourceForm({ initialData, isEditing, isSubmitting }) {
  const [formData, setFormData] = useState(initialData);
  const navigate = useNavigate();

  function handleChange(e) {
    // generic handler for every field type
  }

  return (
    <Form method="post" className="space-y-4">
    </Form>
  );
}