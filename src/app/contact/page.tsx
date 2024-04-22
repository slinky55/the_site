'use client'

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import ReCAPTCHA from "react-google-recaptcha";
import { v4 as uuidv4 } from 'uuid';
import { Image } from '../types/image';
import { Div } from '../types/div';

export default function ContactPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [divs, setDivs] = useState<Div[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [msg, setMsg] = useState('');
  const [captcha, setCaptcha] = useState(null);
  const [postSuccess, setPostSuccess] = useState(false); 

  useEffect(() => {
    const queryData = {
      method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: 'contact',
          limit: 1000,
          offset: 0,
        })
    }
    async function getImgs() {
        try {
            const res = await fetch("/api/images/getimages", queryData);

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();

            if (!Array.isArray(data.images)) {
                throw new Error('Unexpected data format');
            }

            setImages(data.images);
        } catch (error) {
            console.error(error);
        } 
    }
    async function getDivs() {
      try {
          const res = await fetch("/api/divs/getdivs", queryData);

          if (!res.ok) {
              throw new Error(`HTTP error! Status: ${res.status}`);
          }

          const data = await res.json();

          if (!Array.isArray(data.divs)) {
              throw new Error('Unexpected data format');
          }

          setDivs(data.divs);
      } catch (error) {
          console.error(error);
      } 
    }

    getImgs();
    getDivs();
  }, [])

  useEffect(() => { 
    // Run when postSuccess state changes
    if (postSuccess) {
      const messageElement = document.querySelector('.text-center.font-bold');
      if (messageElement) {
        messageElement.classList.remove('hidden');
        setTimeout(() => {
          messageElement.classList.add('hidden');
          setPostSuccess(false);
        }, 3000); // Hide the message after 3 seconds
      }
    }
  }, [postSuccess]); 

  async function createInquiry(event: { preventDefault: () => void; }) {
    event.preventDefault(); // Prevent default form submission

    if (!captcha) {
      alert('Please verify the captcha before submitting the form.');
      return;
    }

    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inquiry_id: uuidv4(),
        content: msg,
        first_name: firstName,
        last_name: lastName,
        email: email,
        subj: subject,
        msg: msg,
      })
    };

    try {
      await fetch('/api/inquiries/createinquiry', postData);
      setPostSuccess(true);
      setFirstName('');
      setLastName('');
      setEmail('');
      setSubject('');
      setMsg('');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the form. Please try again later.');
    }
  }

  function getItem(l: string, img: boolean) {
    if(img) {
      for(let i = 0; i < images.length; i++) {
        if(images[i].label===l) {
          return images[i]
        }
      }
    }
    else {
      for(let i = 0; i < divs.length; i++) {
        if(divs[i].label===l) {
          return divs[i]
        }
      }
    }
  }

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Contact Us</h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          {(getItem('intro', false) as Div)?.content}
        </p>
      </div>
      <form onSubmit={createInquiry} className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">
              First name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="firstName"
                id="firstName"
                autoComplete="given-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-400 sm:text-sm sm:leading-6"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">
              Last name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="lastName"
                id="lastName"
                autoComplete="family-name"
                onChange={(e) => setLastName(e.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-400 sm:text-sm sm:leading-6"
                value={lastName}
                required
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
              Email
            </label>
            <div className="mt-2.5">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-400 sm:text-sm sm:leading-6"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
              Subject
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="subject"
                id="subject"
                autoComplete="subject"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-400 sm:text-sm sm:leading-6"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
              Message
            </label>
            <div className="mt-2.5">
              <textarea
                name="msg"
                rows={4}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-400 sm:text-sm sm:leading-6"
                defaultValue={''}
                id="msg"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder='Max number of characters: 250'
                required
              />
            </div>
          </div>
          <div className="sm:col-span-2 sm:row-span-4">
            <ReCAPTCHA
              className={styles.captcha}
              sitekey="6Lelfp4pAAAAAFxiaaIe0QtZEOxOtk_OJJ77Jujw"
              onChange={(val: any) => setCaptcha(val)}
            />
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-red-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
          >
            Send Message
          </button>
          <p className="text-center mt-4 text-green-500 font-bold hidden">Your Message was Successfully Sent!</p>
        </div>
      </form>
    </div>
  );
}
