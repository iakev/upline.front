import * as yup from 'yup';

// Schema for the public contact form submission
export const contactFormSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  message: yup.string().required('Message is required').min(10, 'Message should be at least 10 characters long'),
});

// Schema for ContactForm list filtering/pagination (if needed for admin view)
// export const getContactFormsFilterSchema = yup.object().shape({...});
