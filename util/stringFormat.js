function removeAngularBrackets(inputString) {
    // Use regular expression to remove anything inside angular brackets
    const cleanedString = inputString?.replace(/<[^>]*>/g, '');
    return cleanedString?.substring(0, 50);
  }

export default removeAngularBrackets;