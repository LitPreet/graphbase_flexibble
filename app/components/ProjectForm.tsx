"use client"
import { useState } from 'react';
import { SessionInterface } from "@/common.types"
import { ChangeEvent } from 'react';
import { Image } from "next/dist/client/image-component";
import FormField from "./FormField";
import { categoryFilters } from "@/constants";
import CustomMenu from "./CustomMenu";
import Button from './Button';

type Props = {
  type: string,
  session: SessionInterface
}

const ProjectForm = ({ type, session }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    image: '',
    title: '',
    description: '',
    liveSiteUrl: '',
    githubUrl: '',
    category: '',
  })
  const handleFormSubmit = (e: React.FormEvent) => { }
  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if(!file) return;
    if(!file.type.includes('image')) return alert('Please upload image');

const reader= new FileReader();
reader.readAsDataURL(file);
reader.onload = () => {
  const result = reader.result as string;
  handleStateChange('image', result);
}
   }
  const handleStateChange = (fieldName: string, value: string) => {
setForm((prevState) => ({...prevState, [fieldName]: value}))
  }
  const image = null;
 
  
  return (

    <form onSubmit={handleFormSubmit} className="flexStart form">
      <div className="flexStart form_image-container">
        <label htmlFor="poster" className="flexCenter form_image-label">{!form.image && 'Choose a poster for your project'}</label>
        <input type="file" id="image" accept="image/*" required={type === 'create'} className="form_image-input" onChange={handleChangeImage} />
        {form.image && (
          <Image
            src={form?.image}
            className="sm:p-10 object-contain z-20"
            alt="project poster"
            fill
          />
        )}
      </div>
      <FormField
        title="Title"
        state={form.title}
        placeholder="flexxible"
        setState={(value) => handleStateChange('title', value)} isTextArea={false} />
      <FormField
        title="Description"
        state={form.description}
        placeholder="Showcase and discover remarkable developer projects"
        setState={(value) => handleStateChange('description', value)} isTextArea={false} />
      <FormField
        type="url"
        title="Website URL"
        state={form.liveSiteUrl}
        placeholder="https://www.project.com"
        setState={(value) => handleStateChange('liveSiteUrl', value)} isTextArea={false} />
      <FormField
        title="GitHub URL"
        state={form.githubUrl}
        placeholder="https://github.com/litpreet"
        setState={(value) => handleStateChange('githubUrl', value)} isTextArea={false} />

      <CustomMenu title="category" state={form.category} filters={categoryFilters} setState={(value) => handleStateChange('category', value)} />
      <div className="flexStart w-full ">
        <Button title={isSubmitting ? `${type === 'create' ? 'Creating' : 'Editing'}` : `${type === 'create' ? 'create' : 'Edit'}`} type="submit" leftIcon = {isSubmitting ? '' : '/plus.svg'} isSubmitting={isSubmitting} />
      </div>
    </form>

  )
}

export default ProjectForm
