import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.owner.upsert({
    where: { email: "jack@example.com" },
    update: {},
    create: {
      areaLocation: "Bishan",
      ownerName: "Jack",
      petPicture: [
        "https://images.dog.ceo/breeds/schipperke/n02104365_9369.jpg",
        "https://images.dog.ceo/breeds/schipperke/n02104365_4107.jpg",
      ],
      petName: "Max",
      petBreed: "Schipperke",
      petGender: "Male",
      petAge: 3,
      petSize: "Medium",
      petDescription: "Really good dog",
      petIsNeutered: true,
      email: "jack@example.com",
      password: "password0",
    },
  });

  await prisma.owner.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      areaLocation: "Ang Mo Kio",
      ownerName: "John",
      petPicture: [
        "https://images.dog.ceo/breeds/terrier-toy/n02087046_267.jpg",
        "https://images.dog.ceo/breeds/terrier-lakeland/n02095570_4650.jpg",
      ],
      petName: "Buddy",
      petBreed: "Toy Terrier",
      petGender: "Male",
      petAge: 4,
      petSize: "Small",
      petDescription: "Loves to play fetch",
      petIsNeutered: true,
      email: "john@example.com",
      password: "password1",
    },
  });

  await prisma.owner.upsert({
    where: { email: "jane@example.com" },
    update: {},
    create: {
      areaLocation: "Toa Payoh",
      ownerName: "Jane",
      petPicture: [
        "https://images.dog.ceo/breeds/terrier-westhighland/n02098286_6129.jpg",
        "https://images.dog.ceo/breeds/terrier-wheaten/clementine.jpg",
      ],
      petName: "Bella",
      petBreed: "West Highland White Terrier",
      petGender: "Female",
      petAge: 2,
      petSize: "Small",
      petDescription: "Very friendly",
      petIsNeutered: false,
      email: "jane@example.com",
      password: "password2",
    },
  });

  await prisma.owner.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      areaLocation: "Jurong",
      ownerName: "Alice",
      petPicture: [
        "https://images.dog.ceo/breeds/dachshund/daschund-1.jpg",
        "https://images.dog.ceo/breeds/terrier-border/n02093754_373.jpg",
      ],
      petName: "Charlie",
      petBreed: "Dachshund",
      petGender: "Male",
      petAge: 5,
      petSize: "Small",
      petDescription: "Loves to swim",
      petIsNeutered: true,
      email: "alice@example.com",
      password: "password3",
    },
  });

  await prisma.owner.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      areaLocation: "Bukit Timah",
      ownerName: "Bob",
      petPicture: [
        "https://images.dog.ceo/breeds/mexicanhairless/n02113978_1787.jpg",
        "https://images.dog.ceo/breeds/mexicanhairless/n02113978_700.jpg",
      ],
      petName: "Rocky",
      petBreed: "Mexican Hairless",
      petGender: "Male",
      petAge: 4,
      petSize: "Medium",
      petDescription: "Very energetic",
      petIsNeutered: false,
      email: "bob@example.com",
      password: "password4",
    },
  });

  await prisma.owner.upsert({
    where: { email: "mary@example.com" },
    update: {},
    create: {
      areaLocation: "Woodlands",
      ownerName: "Mary",
      petPicture: [
        "https://images.dog.ceo/breeds/brabancon/n02112706_1995.jpg",
      ],
      petName: "Daisy",
      petBreed: "Brabancon",
      petGender: "Female",
      petAge: 3,
      petSize: "Small",
      petDescription: "Loves to cuddle",
      petIsNeutered: true,
      email: "mary@example.com",
      password: "password5",
    },
  });

  await prisma.owner.upsert({
    where: { email: "michael@example.com" },
    update: {},
    create: {
      areaLocation: "Sengkang",
      ownerName: "Michael",
      petPicture: [
        "https://images.dog.ceo/breeds/stbernard/n02109525_9379.jpg",
      ],
      petName: "Zeus",
      petBreed: "St. Bernard",
      petGender: "Male",
      petAge: 6,
      petSize: "Large",
      petDescription: "Very protective",
      petIsNeutered: true,
      email: "michael@example.com",
      password: "password6",
    },
  });

  await prisma.owner.upsert({
    where: { email: "susan@example.com" },
    update: {},
    create: {
      areaLocation: "Pasir Ris",
      ownerName: "Susan",
      petPicture: [
        "https://images.dog.ceo/breeds/hound-ibizan/n02091244_822.jpg",
      ],
      petName: "Lola",
      petBreed: "Ibizan Hound",
      petGender: "Female",
      petAge: 4,
      petSize: "Large",
      petDescription: "Very gentle",
      petIsNeutered: false,
      email: "susan@example.com",
      password: "password7",
    },
  });

  await prisma.owner.upsert({
    where: { email: "peter@example.com" },
    update: {},
    create: {
      areaLocation: "Yishun",
      ownerName: "Peter",
      petPicture: [
        "https://images.dog.ceo/breeds/greyhound-italian/n02091032_1121.jpg",
        "https://images.dog.ceo/breeds/greyhound-italian/n02091032_11843.jpg",
      ],
      petName: "Oscar",
      petBreed: "Italian Greyhound",
      petGender: "Male",
      petAge: 3,
      petSize: "Small",
      petDescription: "Very curious",
      petIsNeutered: true,
      email: "peter@example.com",
      password: "password8",
    },
  });

  await prisma.owner.upsert({
    where: { email: "emma@example.com" },
    update: {},
    create: {
      areaLocation: "Serangoon",
      ownerName: "Emma",
      petPicture: [
        "https://images.dog.ceo/breeds/wolfhound-irish/n02090721_2836.jpg",
        "https://images.dog.ceo/breeds/wolfhound-irish/n02090721_7602.jpg",
      ],
      petName: "Milo",
      petBreed: "Irish Wolfhound",
      petGender: "Male",
      petAge: 4,
      petSize: "Large",
      petDescription: "Loves to run",
      petIsNeutered: false,
      email: "emma@example.com",
      password: "password9",
    },
  });

  await prisma.owner.upsert({
    where: { email: "oliver@example.com" },
    update: {},
    create: {
      areaLocation: "Clementi",
      ownerName: "Oliver",
      petPicture: [
        "https://images.dog.ceo/breeds/retriever-flatcoated/n02099267_3092.jpg",
      ],
      petName: "Toby",
      petBreed: "Flat-Coated Retriever",
      petGender: "Male",
      petAge: 5,
      petSize: "Large",
      petDescription: "Very playful",
      petIsNeutered: true,
      email: "oliver@example.com",
      password: "password10",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
