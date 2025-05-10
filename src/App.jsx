import { Container, createTheme, ThemeProvider, Box, Typography, Button, TextField } from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { fetchApi } from "./features/fetchDataSlice";

const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
  },
});
const date = new Date();
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const weekdayAr = ["الاحد", "الاثنين", "الثلاثاء", "الاربعاء", "الخميس", "الجمعه", "السبت"];

const App = () => {
  const { loading, data, error } = useSelector((state) => state.weatherApi);
  const dispatch = useDispatch();

  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem("Language");
    return savedLanguage ? JSON.parse(savedLanguage) : "ar";
  });
  const [city, setCity] = useState(() => {
    const savedCity = localStorage.getItem("City");
    return savedCity ? JSON.parse(savedCity) : "cairo";
  });
  const [inputValue, setInputValue] = useState("");

  const day = language === "ar" ? weekdayAr[date.getDay()] : weekday[date.getDay()];
  const dateNow = language === "ar" ? date.toLocaleDateString("ar-SA") : date.toLocaleDateString();

  useEffect(() => {
    dispatch(fetchApi({ city, lang: language }));
  }, [city, dispatch, language]);

  const handleSearch = () => {
    if (inputValue.trim() === "") return;
    setCity(inputValue.trim());
    setInputValue("");
  };

  const cityName = data.name || "";
  const temp = data.main?.temp || 0;
  const temp_min = data.main?.temp_min || 0;
  const temp_max = data.main?.temp_max || 0;
  const icon = data.weather?.[0]?.icon || "";
  const description = data.weather?.[0]?.description || "";

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          <Box component="div" className="content-container" sx={{ direction: language === "ar" ? "rtl" : "ltr", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
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
                  placeholder={language === "ar" ? "ابحث عن المدينة (بالانجليزية)" : "Search for a city (in English)"}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button variant="outlined" sx={{ textTransform: "capitalize", color: "#fff" }} onClick={handleSearch}>
                  {language === "ar" ? "بحث" : "search"}
                </Button>
              </Box>
              {loading ? (
                <Box component="div" className="loader" sx={{ width: "100%", textAlign: "center", marginTop: "1rem" }}>
                  <ClipLoader color="#fff" size={50} />
                </Box>
              ) : error ? (
                <Box component="div" className="loader" sx={{ width: "100%", textAlign: "center", marginTop: "1rem" }}>
                  <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                    {language === "ar" ? "اسم المدينة غير صحيح، جرب اسم آخر" : "invalid city name, try another name"}
                  </Typography>
                </Box>
              ) : (
                <Box component="div" className="content">
                  <Box component="div" className="city&time" flexDirection={{ xs: "column", sm: "row" }} alignItems={{ xs: "center", sm: "end" }} sx={{ display: "flex", justifyContent: "space-between", gap: "20px", padding: "0 10px" }}>
                    <Typography variant="h2" sx={{ fontWeight: "500" }}>
                      {cityName}
                    </Typography>
                    <Typography variant="h5">{`${day} ${dateNow}`}</Typography>
                  </Box>
                  <hr style={{ marginBottom: "10px" }} />
                  <Box component="div" className="degree&cloudIcon" flexDirection={{ xs: "column", sm: "row" }} sx={{ display: "flex", alignItems: "center", justifyContent: "space-around", gap: "20px" }}>
                    <Box component="div" className="degree&description">
                      <Box component="div" className="temp" sx={{ display: "flex", alignItems: "center", justifyContent: "space-around", gap: "10px" }}>
                        <Typography variant="h1" className="main-temp">
                          {Math.round(temp)}
                        </Typography>
                        <Typography variant="h6" sx={{ alignSelf: "flex-start", marginInline: "-20px" }}>
                          {language === "ar" ? "C°" : "°C"}
                        </Typography>
                        <img src={`http://openweathermap.org/img/w/${icon}.png`} alt="weather icon" />
                      </Box>

                      <Typography variant="h6" className="main-temp">
                        {description}
                      </Typography>

                      <Box component="div" className="min&max" sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Typography variant="h6" className="min-temp" sx={{ fontWeight: "300" }}>
                          {language === "ar" ? "الصغري" : "Min"}: {Math.floor(temp_min)}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: "300", alignSelf: "flex-start", marginTop: "3px", marginInline: "-4px", fontSize: "10px" }}>
                          C°
                        </Typography>
                        <Box component="span">|</Box>
                        <Typography variant="h6" className="max-temp" sx={{ fontWeight: "300" }}>
                          {language === "ar" ? "الكبري" : "Max"}: {Math.ceil(temp_max)}
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
              <Button variant="text" sx={{ color: "#fff", textTransform: "capitalize" }} onClick={() => setLanguage(language == "ar" ? "en" : "ar")}>
                {language === "ar" ? "English" : "عربي"}
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default App;
