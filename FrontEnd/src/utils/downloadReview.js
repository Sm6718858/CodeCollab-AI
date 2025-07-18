export const downloadReview = (review) => {
  const element = document.createElement("a");
  const file = new Blob([review], { type: 'text/markdown' });
  element.href = URL.createObjectURL(file);
  element.download = `code-review-${new Date().toISOString().slice(0, 10)}.md`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
