import csv

def extract_doctor_names(input_file, output_file):
    doctor_names = []
    with open(input_file, 'r', newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter='\t')
        next(reader)  # Skip header row
        for row in reader:
            doctor_name = row[1].split(',')[0].strip()
            doctor_names.append([doctor_name])
    
    with open(output_file, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['Doctor\'s Name'])  # Write header
        writer.writerows(doctor_names)

# Example usage:
input_csv_file = 'doctors.csv'  # Replace with your input CSV file path
output_csv_file = 'output.csv'  # Replace with your desired output CSV file path
extract_doctor_names(input_csv_file, output_csv_file)
