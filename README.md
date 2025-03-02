# **Cron Expression Visualizer**  
A web-based tool to visualize and analyze cron expressions using charts. This application helps users understand cron schedules by displaying execution times on a yearly heatmap and a daily polar chart.

---

## **Features**
- 🌟 **Cron Expression Input**: Easily input cron expressions and validate them.  
- 📅 **Yearly Heatmap**: See all execution days in a calendar view.  
- 🕒 **Daily Polar Chart**: Visualize execution times within a single day.  
- 🎨 **Dark & Light Mode**: Toggle between dark and light themes.  
- 🌍 **Timezone Support**: Adjust execution times based on a selected timezone.  
- ⚡ **Optimized Parsing**: Uses batch calculations for efficiency.  
- 🔄 **Cron Modifications**: Modify cron expressions dynamically (e.g., ignore specific fields).  

---

## **Tech Stack**
- **Frontend**: React, TypeScript, Ant Design, ECharts  
- **Utilities**: `cron-parser`, `dayjs` for date manipulations  
- **State Management**: React hooks (`useState`, `useEffect`)  
- **Styling**: Ant Design, Custom Theme  

---

## **Installation & Setup**
### **1️⃣ Clone the repository**
```sh
git clone https://github.com/pawinwat/cron-visualizer.git
cd cron-visualizer
```

### **2️⃣ Install dependencies**
```sh
npm install
```

### **3️⃣ Start the development server**
```sh
npm run dev
```
or  
```sh
yarn dev
```

---

## **Usage**
1. **Enter a cron expression** in the input field.  
2. **Select a year & timezone** to adjust the visualization.  
3. **View the yearly execution heatmap** and **daily execution times** in a polar chart.  
4. **Toggle between dark/light mode** for better readability.  

---

## **License**
MIT License © 2025 Pawinwat
