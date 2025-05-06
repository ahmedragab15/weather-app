import { Container, createTheme, ThemeProvider, Box, Typography, Button, TextField } from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import { useEffect, useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
  },
});
const date = new Date();
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const weekdayAr = ["الاحد", "الاثنين", "الثلاثاء", "الاربعاء", "الخميس", "الجمعه", "السبت"];
const API_Key = "72b809e0a5c9a17ce77e727b3951d8b2";

let cityName = "",
  temp = 0,
  temp_min = 0,
  temp_max = 0,
  icon = "",
  description = "";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [lang, setLang] = useState("ar");
  const [city, setCity] = useState(() => {
    const savedCity = localStorage.getItem("City");
    return savedCity ? JSON.parse(savedCity) : "cairo";
  });
  const [inputValue, setInputValue] = useState("");

  const day = lang === "ar" ? weekdayAr[date.getDay()] : weekday[date.getDay()];
  const dataNow = lang === "ar" ? date.toLocaleDateString("ar-SA") : date.toLocaleDateString();

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key}&units=metric&lang=${lang}`, { signal: controller.signal });
        setData(res.data);
        setIsLoading(false);
        localStorage.setItem("City", JSON.stringify(city));
      } catch (error) {
        if (error.code === "ERR_CANCELED") return;
        setData(null);
        setErrorMessage("Something went wrong. " + error.code);
        setIsLoading(false);
      }
    })();
    return () => {
      controller.abort();
    };
  }, [lang, city]);

  if (data) {
    ({
      name: cityName,
      main: { temp, temp_min, temp_max },
    } = data);
    ({ icon, description } = data.weather[0]);
  }

  const handleSearch = () => {
    if (inputValue.trim() === "") return;
    setErrorMessage("");
    setIsLoading(true);
    setCity(inputValue.trim());
    setInputValue("");
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          <Box component="div" className="content-container" sx={{ direction: lang === "ar" ? "rtl" : "ltr", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Box component="div" className="card" sx={{ width: "100%", background: "rgb(28 52 91 / 36%)", color: "#fff", padding: "15px", borderRadius: "15px", boxShadow: "0 11px 1px rgba(0,0,0,0.05)", maxHeight: "75vh", overflow: "auto" }}>
              <Box component="div" className="input-container" flexDirection={{ xs: "column", sm: "row" }} gap={{ xs: "0", sm: "10px" }} sx={{ display: "flex" }}>
                <TextField
                  sx={{
                    "& .MuiInputBase-input": {
                      height: "35px",
                      color: "#fff",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#fff",
                    },
                  }}
                  fullWidth
                  color="primary"
                  variant="standard"
                  placeholder={lang === "ar" ? "ابحث عن المدينة (بالانجليزية)" : "Search for a city (in English)"}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setErrorMessage("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button variant="outlined" sx={{ textTransform: "capitalize", color: "#fff" }} onClick={handleSearch}>
                  {lang === "ar" ? "بحث" : "search"}
                </Button>
              </Box>
              {isLoading ? (
                <Box component="div" className="loader" sx={{ width: "100%", textAlign: "center" }}>
                  <ClipLoader color="#fff" size={50} />
                </Box>
              ) : errorMessage ? (
                <Box component="div" className="loader" sx={{ width: "100%", textAlign: "center" }}>
                  <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                    {lang === "ar" ? "اسم المدينة غير صحيح، جرب اسم آخر" : "invalid city name, try another name"}
                  </Typography>
                </Box>
              ) : (
                <Box component="div" className="content">
                  <Box component="div" className="city&time" flexDirection={{ xs: "column", sm: "row" }} alignItems={{ xs: "center", sm: "end" }} sx={{ display: "flex", justifyContent: "space-between", gap: "20px", padding: "0 10px" }}>
                    <Typography variant="h2" sx={{ fontWeight: "500" }}>
                      {cityName}
                    </Typography>
                    <Typography variant="h5">{`${day} ${dataNow}`}</Typography>
                  </Box>
                  <hr style={{ marginBottom: "10px" }} />
                  <Box component="div" className="degree&cloudIcon" flexDirection={{ xs: "column", sm: "row" }} sx={{ display: "flex", alignItems: "center", justifyContent: "space-around", gap: "20px" }}>
                    <Box component="div" className="degree&description">
                      <Box component="div" className="temp" sx={{ display: "flex", alignItems: "center", justifyContent: "space-around", gap: "10px" }}>
                        <Typography variant="h1" className="main-temp">
                          {Math.round(temp)}
                        </Typography>
                        <Typography variant="h6" sx={{ alignSelf: "flex-start", marginInline: "-20px" }}>
                          {lang === "ar" ? "C°" : "°C"}
                        </Typography>
                        <img src={`http://openweathermap.org/img/w/${icon}.png`} alt="weather icon" />
                      </Box>

                      <Typography variant="h6" className="main-temp">
                        {description}
                      </Typography>

                      <Box component="div" className="min&max" sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Typography variant="h6" className="min-temp" sx={{ fontWeight: "300" }}>
                          {lang === "ar" ? "الصغري" : "Min"}: {Math.floor(temp_min)}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: "300", alignSelf: "flex-start", marginTop: "3px", marginInline: "-4px", fontSize: "10px" }}>
                          C°
                        </Typography>
                        <Box component="span">|</Box>
                        <Typography variant="h6" className="max-temp" sx={{ fontWeight: "300" }}>
                          {lang === "ar" ? "الكبري" : "Max"}: {Math.ceil(temp_max)}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: "300", alignSelf: "flex-start", marginTop: "3px", marginInline: "-4px", fontSize: "10px" }}>
                          C°
                        </Typography>
                      </Box>
                    </Box>
                    <CloudIcon sx={{ fontSize: "200px" }} />
                  </Box>
                </Box>
              )}
            </Box>
            <Box component="div" className="change-language" sx={{ width: "100%", display: "flex", justifyContent: "end", marginTop: "20px" }}>
              <Button variant="text" sx={{ color: "#fff", textTransform: "capitalize" }} onClick={() => setLang(lang == "ar" ? "en" : "ar")}>
                {lang === "ar" ? "English" : "عربي"}
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;
