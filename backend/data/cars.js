import mongoose from "mongoose";
import Car from "../Models/car.js";

const URI = "mongodb+srv://shashank:shashank123@sem6-project.lfg2l.mongodb.net/SEM_6?retryWrites=true&w=majority&appName=Sem6-Project";

const carData = [
  {
      "name": "Tesla Model S",
      "variant": "Long Range",
      "colors": [
          {
              "color": "Red",
              "price": 799999,
              "images": [
                  "https://hips.hearstapps.com/hmg-prod/images/screen-shot-2023-03-10-at-10-03-14-am-640b5b0f39e1c.jpg",
              ]
          },
          {
              "color": "Black",
              "price": 849990,
              "images": [
                  "https://www.teslarati.com/wp-content/uploads/2018/08/tesla-roadster-matte-black-1-e1534872442960.jpeg",
              ]
          }
      ],
      "offers": "Free Supercharging for 6 months",
      "model_no": "TSLA-MDL-S-LR",
      "description": "The Tesla Model S is a fully electric luxury sedan that offers impressive speed, range, and cutting-edge technology. Enjoy an ultra-modern driving experience with the best in electric power.",
      "date": "2024-01-15",
      "year": 2024,
      "mileage": "370 miles"
  },
  {
      "name": "Ford Mustang",
      "variant": "GT",
      "colors": [
          {
              "color": "Blue",
              "price": 7550000,
              "images": [
                  "https://ddb6a72d2feaeca8eb46-183c3b2eaab36bc0f4003ed58203ce4f.ssl.cf1.rackcdn.com/mustang-blue-paint-color-codes_e234a5f6.jpg",
              ]
          },
          {
              "color": "Yellow",
              "price": 7570000,
              "images": [
                  "https://www.shutterstock.com/image-photo/kuala-lumpurmalaysia-may-31-2022-260nw-2162365333.jpg",
              ]
          }
      ],
      "offers": "0% APR Financing for 60 months",
      "model_no": "FORD-MSTNG-GT",
      "description": "The Ford Mustang GT is an iconic American muscle car that combines raw power with modern styling. Equipped with a powerful V8 engine, it's built for performance enthusiasts.",
      "date": "2024-02-10",
      "year": 2024,
      "mileage": "25 MPG"
  },
  {
      "name": "BMW X5",
      "variant": "xDrive40i",
      "colors": [
          {
              "color": "White",
              "price": 10700000,
              "images": [
                  "https://static.autox.com/uploads/2023/07/2023-BMW-X5-New.jpg",
              ]
          },
          {
              "color": "Grey",
              "price": 9725000,
              "images": [
                  "https://imgd.aeplcdn.com/1920x1080/n/cw/ec/152681/x5-facelift-exterior-left-front-three-quarter-2.jpeg?isig=0&q=80&q=80",
              ]
          }
      ],
      "offers": "Complimentary BMW Maintenance for 3 years",
      "model_no": "BMW-X5-XD40i",
      "description": "The BMW X5 is a luxurious and powerful SUV designed for both comfort and performance. Featuring advanced technology, a spacious interior, and an exceptional driving experience.",
      "date": "2024-03-01",
      "year": 2024,
      "mileage": "22 MPG"
  },
  {
      "name": "Audi A6",
      "variant": "Premium Plus",
      "colors": [
          {
              "color": "Silver",
              "price": 6455000,
              "images": [
                  "https://dealer-content.s3.amazonaws.com/images/models/audi/2022/a6/colors/florett-silver-metallic.png",
              ]
          },
          {
              "color": "Black",
              "price": 6457000,
              "images": [
                  "https://stimg.cardekho.com/images/car-images/large/Audi/A6/10552/1700631416593/224_Firmament-Blue-Metallic_11192c.jpg?impolicy=resize&imwidth=420",
              ]
          }
      ],
      "offers": "Get 2 years of free maintenance",
      "model_no": "AUDI-A6-PREMIUM",
      "description": "The Audi A6 combines elegant design, a luxurious interior, and a host of technology features, making it one of the top choices in its class. With an efficient yet powerful engine, it's perfect for those who value both performance and comfort.",
      "date": "2024-04-05",
      "year": 2024,
      "mileage": "28 MPG"
  },
  {
      "name": "Mercedes-Benz C-Class",
      "variant": "AMG C 43",
      "colors": [
          {
              "color": "Palladium Silver",
              "price": 6545000,
              "images": [
                  "https://stimg.cardekho.com/images/car-images/large/Mercedes-Benz/Mercedes-Benz-New-C-Class/Palladium_silver_metallic.jpg?impolicy=resize&imwidth=420",
              ]
          },
          {
              "color": "Iridium Black",
              "price": 6746000,
              "images": [
                  "https://imgd.aeplcdn.com/664x374/n/4qubpdb_1746087.jpg?q=80",
              ]
          }
      ],
      "offers": "Cashback of ₹50,000",
      "model_no": "MERC-CCLASS-AMG43",
      "description": "The Mercedes-Benz C-Class is a compact luxury sedan that offers a perfect blend of performance, comfort, and technology. The AMG C 43 variant delivers powerful acceleration and a thrilling driving experience.",
      "date": "2024-05-15",
      "year": 2024,
      "mileage": "23 MPG"
  },
  {
      "name": "Honda Civic",
      "variant": "EX-L",
      "colors": [
          {
              "color": "Red",
              "price": 2125000,
              "images": [
                  "https://www.shutterstock.com/image-photo/bicesteroxonuk-april-23rd-2023-2021-260nw-2294095403.jpg",
              ]
          },
          {
              "color": "Blue",
              "price": 2126000,
              "images": [
                  "https://cdn.motor1.com/images/mgl/oV3mE/s3/2020-honda-civic-type-r.jpg",
              ]
          }
      ],
      "offers": "Cashback of ₹20,000",
      "model_no": "HONDA-CIVIC-EXL",
      "description": "The Honda Civic is a compact sedan with sleek styling, excellent fuel efficiency, and a smooth ride. It comes with a range of tech and safety features.",
      "date": "2024-01-10",
      "year": 2024,
      "mileage": "32 MPG"
  },
  {
      "name": "Toyota Corolla",
      "variant": "LE",
      "colors": [
          {
              "color": "White",
              "price": 1622000,
              "images": [
                  "https://imagecdnsa.zigwheels.ae/large/gallery/color/40/417/toyota-corolla-color-536356.jpg",
              ]
          },
          {
              "color": "Silver",
              "price": 1722500,
              "images": [
                  "https://di-uploads-pod6.dealerinspire.com/savannahtoyota/uploads/2020/09/silver.png",
              ]
          }
      ],
      "offers": "0% APR for 60 months",
      "model_no": "TOYOTA-COROLLA-LE",
      "description": "The Toyota Corolla offers a reliable and affordable option for those seeking comfort and efficiency. With a sleek design and excellent safety features, it's a popular choice for families.",
      "date": "2024-02-20",
      "year": 2024,
      "mileage": "30 MPG"
  },
  {
    "name": "Chevrolet Camaro",
    "variant": "LT1",
    "colors": [
        {
            "color": "Orange",
            "price": 5035000,
            "images": [
                "https://di-uploads-pod2.dealerinspire.com/carlblackchevybuickgmcorlando/uploads/2019/06/2020-Chevrolet-Camaro-Summit-Crush.jpg",
            ]
        },
        {
            "color": "Red",
            "price": 5036000,
            "images": [
                "https://di-uploads-pod2.dealerinspire.com/carlblackchevybuickgmcorlando/uploads/2019/06/2020-Chevrolet-Camaro-Red-Hot.jpg",
            ]
        }
    ],
    "offers": "Lease for $299/month",
    "model_no": "CHEVY-CAMARO-LT1",
    "description": "The Chevrolet Camaro is a powerful muscle car with sleek styling, excellent handling, and an exhilarating driving experience.",
    "date": "2024-06-05",
    "year": 2024,
    "mileage": "22 MPG"
},
{
    "name": "Nissan 370Z",
    "variant": "Sport",
    "colors": [
        {
            "color": "Yellow",
            "price": 5538000,
            "images": [
                "https://www.daveallenphotography.com/pics/370z_001.jpg",
            ]
        },
        {
            "color": "Black",
            "price": 5539000,
            "images": [
                "https://cfwww.hgreg.com/photos/by-size/KM422087/3648x2048/content.homenetiol.com_2001243_2170803_0x0_903330e6efbb4590ac420d8d0595542d.jpg",
            ]
        }
    ],
    "offers": "Cashback of $5000",
    "model_no": "NISSAN-370Z-SPORT",
    "description": "The Nissan 370Z is a high-performance sports car that delivers thrilling acceleration, sharp handling, and aggressive styling.",
    "date": "2024-07-10",
    "year": 2024,
    "mileage": "18 MPG"
},
{
    "name": "Mazda MX-5 Miata",
    "variant": "Club",
    "colors": [
        {
            "color": "Blue",
            "price": 1526000,
            "images": [
                "https://i.ytimg.com/vi/b8kZRj0wwAw/maxresdefault.jpg",
            ]
        },
        {
            "color": "Red",
            "price": 1527000,
            "images": [
                "https://www.slashgear.com/img/gallery/2023-mazda-mx-5-miata-review-happiness-is/l-intro-1690984877.jpg",
            ]
        }
    ],
    "offers": "0% APR for 72 months",
    "model_no": "MAZDA-MX5-CLUB",
    "description": "The Mazda MX-5 Miata is a lightweight, rear-wheel-drive convertible that offers an unmatched fun-to-drive experience.",
    "date": "2024-08-01",
    "year": 2024,
    "mileage": "30 MPG"
},
{
    "name": "Subaru WRX",
    "variant": "STI",
    "colors": [
        {
            "color": "Blue",
            "price": 3240000,
            "images": [
                "https://www.subaru.co.nz/sites/default/files/styles/scale_width_media_large/public/images/migrated/field/teaser_image/DSC_3347%20small.jpg?itok=LifI_lZ0",
            ]
        },
        {
            "color": "White",
            "price": 3341000,
            "images": [
                "https://www.motortrend.com/uploads/sites/5/2019/11/2020-Subaru-WRX-STI-Series-White-1.jpg?w=768&width=768&q=75&format=webp",
            ]
        }
    ],
    "offers": "Get $2000 trade-in bonus",
    "model_no": "SUBARU-WRX-STI",
    "description": "The Subaru WRX is a turbocharged sports sedan known for its sharp handling, all-wheel drive, and rally-inspired performance.",
    "date": "2024-08-10",
    "year": 2024,
    "mileage": "23 MPG"
},
{
    "name": "Hyundai Genesis Coupe",
    "variant": "3.8 Ultimate",
    "colors": [
        {
            "color": "Silver",
            "price": 3527000,
            "images": [
                "https://cars.usnews.com/static/images/Auto/izmo/Colors/hyundai_15genesiscoupe382a_santiagosilver.jpg",
            ]
        },
        {
            "color": "Black",
            "price": 3528000,
            "images": [
                "https://www.genesis.com/content/dam/genesis-p2/worldwide/assets/models/gv80-coupe/color-view/genesis-ww-gv80-coupe-color-glossy-vik-black-small.png",
            ]
        }
    ],
    "offers": "0% APR Financing for 60 months",
    "model_no": "HYUNDAI-GENESIS-COUPE",
    "description": "The Hyundai Genesis Coupe offers strong performance, sharp handling, and an elegant design that makes it stand out among competitors.",
    "date": "2024-08-15",
    "year": 2024,
    "mileage": "24 MPG"
},
{
    "name": "Kia Stinger",
    "variant": "GT2",
    "colors": [
        {
            "color": "Yellow",
            "price": 5042000,
            "images": [
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSLCUCX8HCDg8jI--zrvn_wlfA7qaikQUUsg&s",
            ]
        },
        {
            "color": "Red",
            "price": 5143000,
            "images": [
                "https://cdn-ds.com/blogs-media/sites/634/2019/05/15164602/2020-Kia-Stinger_B_o.jpg",
            ]
        }
    ],
    "offers": "Free Scheduled Maintenance for 3 years",
    "model_no": "KIA-STINGER-GT2",
    "description": "The Kia Stinger is a stylish and powerful sedan that blends athletic performance with luxury features.",
    "date": "2024-09-01",
    "year": 2024,
    "mileage": "22 MPG"
},
{
    "name": "Jeep Wrangler",
    "variant": "Sport",
    "colors": [
        {
            "color": "Green",
            "price": 6735000,
            "images": [
                "https://imgd.aeplcdn.com/370x208/n/fl5cgdb_1735313.jpg?q=80",
            ]
        },
        {
            "color": "Black",
            "price": 6936000,
            "images": [
                "hhttps://automaxgroup.me/wp-content/uploads/2024/02/2024-WRANGLER-UNLIMITED-SAHARA-Black-Black-Interior-Winter-Package-1024x1024-1.jpg",
            ]
        }
    ],
    "offers": "Free roof rack installation",
    "model_no": "JEEP-WRANGLER-SPORT",
    "description": "The Jeep Wrangler is a rugged off-road SUV with excellent capabilities and a strong sense of adventure.",
    "date": "2024-09-10",
    "year": 2024,
    "mileage": "18 MPG"
},
{
    "name": "Chrysler 300",
    "variant": "Limited",
    "colors": [
        {
            "color": "Silver",
            "price": 8040000,
            "images": [
                "https://cars.usnews.com/static/images/Auto/izmo/Colors/chrysler_14300chemi2a_billetsilvermetallic.jpg",
            ]
        },
        {
            "color": "Black",
            "price": 8142000,
            "images": [
                "https://medias.fcacanada.ca/jellies/renditions/2023/800x510/CC23_LXCT48_2DF_PX8_APA_XXX_XXX_XXX.6b8b407984b85d4fadd06e2bb274f473.png",
            ]
        }
    ],
    "offers": "Get $2500 off with trade-in",
    "model_no": "CHRYSLER-300-LIMITED",
    "description": "The Chrysler 300 is a full-size luxury sedan that combines performance, comfort, and technology.",
    "date": "2024-09-15",
    "year": 2024,
    "mileage": "25 MPG"
},
{
    "name": "Ram 1500",
    "variant": "Laramie",
    "colors": [
        {
            "color": "Blue",
            "price": 7045000,
            "images": [
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZCwl8wuRn665F_hR46_jbN-BCjEbq0ZGZog&s",
            ]
        },
        {
            "color": "White",
            "price": 7246000,
            "images": [
                "https://medias.fcacanada.ca/jellies/renditions/2024/800x510/CC24_DT6T98_2TL_PW7_APA_XXX_XXX_XXX.4ed469b9261716334263d16b9dd3d755.png",
            ]
        }
    ],
    "offers": "Get 0% APR for 72 months",
    "model_no": "RAM-1500-LARAMIE",
    "description": "The Ram 1500 is a full-size pickup truck that offers a refined interior, strong towing capabilities, and powerful performance.",
    "date": "2024-10-01",
    "year": 2024,
    "mileage": "19 MPG"
},
{
    "name": "GMC Sierra 1500",
    "variant": "Denali",
    "colors": [
        {
            "color": "Red",
            "price": 3247000,
            "images": [
                "https://dealer-content.s3.amazonaws.com/images/models/gmc/2021/sierra/colors/cayenne-red-tintcoat.png",
            ]
        },
        {
            "color": "Black",
            "price": 3348000,
            "images": [
                "https://dealer-content.s3.amazonaws.com/images/models/gmc/2021/sierra/colors/onyx-black.png",
            ]
        }
    ],
    "offers": "Free towing package for new owners",
    "model_no": "GMC-SIERRA-1500-DENALI",
    "description": "The GMC Sierra 1500 is a powerful truck that blends luxury with ruggedness, offering impressive towing capacity and a high-tech interior.",
    "date": "2024-10-05",
    "year": 2024,
    "mileage": "18 MPG"
}
];
const insertData = async () => {
    try {
        await mongoose.connect(URI);
        console.log("Connected to MongoDB");

        // Insert data
        await Car.insertMany(carData);
        console.log("Cars inserted successfully");

        mongoose.connection.close();
    } catch (error) {
        console.error("Error inserting cars:", error);
    }
};

insertData();
