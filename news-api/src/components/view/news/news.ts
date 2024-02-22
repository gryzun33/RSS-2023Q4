import './news.css';
import { Article, isType, Nullable, getElement, isNull } from '../../../types/types';

class News {
  draw(data: Article[]) {
    const news: Article[] = data.length >= 10 ? data.filter((_item, idx) => idx < 10) : data;

    const fragment: DocumentFragment = document.createDocumentFragment();

    const newsItemTemp: Nullable<HTMLTemplateElement> = document.querySelector('#newsItemTemp');
    console.log('newsItemTemp=', newsItemTemp);
    if (!isType<HTMLTemplateElement>(newsItemTemp, HTMLTemplateElement)) {
      throw new Error();
    }

    news.forEach((item: Article, idx: number) => {
      const newsClone = newsItemTemp.content.cloneNode(true);
      //   console.log('newsClone=', newsClone);
      //   console.log('item=', item);

      if (newsClone instanceof DocumentFragment) {
        // console.log('true');
        const newsItem = getElement<HTMLElement>('.news__item', newsClone);
        const newsMetaPhoto = getElement<HTMLElement>('.news__meta-photo', newsClone);
        const newsMetaAuthor = getElement<HTMLElement>('.news__meta-author', newsClone);
        const newsMetaDate = getElement<HTMLElement>('.news__meta-date', newsClone);
        const newsTitle = getElement<HTMLElement>('.news__description-title', newsClone);
        const newsSource = getElement<HTMLElement>('.news__description-source', newsClone);
        const newsContent = getElement<HTMLElement>('.news__description-content', newsClone);
        const newsLink = getElement<HTMLElement>('.news__read-more a', newsClone);

        if (idx % 2) newsItem.classList.add('alt');

        newsMetaPhoto.style.backgroundImage = `url(${item.urlToImage || 'img/news_placeholder.jpg'})`;
        newsMetaAuthor.textContent = item.author || item.source.name;
        newsMetaDate.textContent = item.publishedAt.slice(0, 10).split('-').reverse().join('-');

        newsTitle.textContent = item.title;
        newsSource.textContent = item.source.name;
        newsContent.textContent = item.description;
        newsLink.setAttribute('href', item.url);

        fragment.append(newsClone);
        console.log('fragment=', fragment);
      }
    });

    const newsBox = document.querySelector('.news');
    if (isNull(newsBox)) {
      throw new Error();
    }

    console.log('news=', newsBox);

    newsBox.innerHTML = '';
    newsBox.appendChild(fragment);
    console.log('news=', newsBox);
  }
}

export default News;
