import React, { useEffect, useState } from 'react'
import { beautyServices } from "./beautyServices";
import { useParams } from 'react-router-dom';
import Header from '../Header'
import Details from './Details'

import SimilarListings from './SimilarListings'
import Heading from './Heading'
// import SimilarListingSlider from './SimilarListingSlider'

const Properties = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState(null);

  useEffect(() => {
      const prop = beautyServices.filter((service) => service.id === parseInt(id))
      setService(prop[0]);
      setTimeout(()=> {
          setLoading(false);
      }, 500)
  }, [id])
  return (
    <>
    {
      loading && !service ? (
        <h2>loading....{id}</h2>
    ) : (
      <div>
      <Header transparent={false} />
      <Heading/>
      <Details service={service}/>
      <SimilarListings />
      
    </div>
    )
    }</>
   
  )
}

export default Properties