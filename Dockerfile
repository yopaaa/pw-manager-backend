# menggunakan image Node.js versi 14 sebagai base image
FROM node:latest

# membuat direktori kerja di dalam container
WORKDIR /app

# menyalin package.json dan package-lock.json ke dalam container
COPY package*.json ./

# menginstall dependensi aplikasi
RUN npm install

# menyalin seluruh file di direktori aplikasi ke dalam container
COPY . .

# melakukan build aplikasi
# RUN npm run start

# mengekspos port 8080
# EXPOSE 8080

# menjalankan aplikasi
CMD [ "npm", "start" ]
