'use strict';
// Includes are trusted HTML authored by the website owner.
(async()=>{
  const results=await Promise.allSettled(Array.from(document.querySelectorAll('[data-content]'),async element=>{
    const path=element.dataset.content;
    try{
      const response=await fetch(path);
      if(!response.ok)throw new Error('Could not load '+path);
      element.innerHTML=await response.text();
    }catch(error){
      element.textContent='Unable to load this section. Please check '+path+'.';
      element.setAttribute('role','alert');
      throw error;
    }
  }));
  results.forEach(result=>{if(result.status==='rejected')console.error(result.reason)});
  // Restore deep links after headings from the research include have loaded.
  if(location.hash){const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target)target.scrollIntoView();}
})();
