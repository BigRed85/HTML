export function setMetaTags({title="", description="", cononicalURL=""}) {
    var head = document.getElementsByTagName('head')[0];

    //clear any prvious tags
    clearTags();

    //set the title meta data
    var titleTag = document.getElementsByTagName('title')[0];
    if (!title) {
        titleTag = document.createElement('title');
        head.appendChild(titleTag);
    }
    titleTag.innerText = title;
    var metaTitle = document.createElement('meta');
    metaTitle.setAttribute('name', 'title');
    metaTitle.content = title;
    head.appendChild(metaTitle);

    //set the descritpion metadata
    var metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.content = description;
    head.appendChild(metaDescription);

    var metaURL = document.createElement('meta');
    metaURL.setAttribute('name', 'cononicalURL');
    metaURL.content = cononicalURL;
    head.appendChild(metaURL);
    
}

function clearTags() {
    
    var metaTags = document.getElementsByTagName('meta');

    //need to iterate for end of list when removing dom elements to ensher no element is skiped over 
    for (let i = metaTags.length-1; i >= 0; i--) {
        let meta = metaTags[i];
        if (meta.name === 'title' || meta.name === 'description' || meta.name === 'cononicalURL') {
            meta.remove();
        }
    }

}