from langchain_community.document_loaders import PyPDFLoader

# 1. Load pdf file
loader = PyPDFLoader("Algebra-and-Trigonometry-2e-WEB.pdf")
pages = loader.load_and_split()
pages[0]

# 2. Split text from the pdf file
