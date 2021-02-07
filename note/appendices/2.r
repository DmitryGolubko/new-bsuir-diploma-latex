#anylizer.r

setwd("/home/dmitry/Documents/regression/parser")
data_f = read.csv("filtered_properties.csv", header = TRUE)

data_f
h <- hist(data_f$area_full, main="Histogram for Full area", xlab="Full Area, sqm", col="green", ylim=c(0,3000))
text(h$mids,h$counts,labels=h$counts, adj=c(0.5, -0.5))

## bathrooms
mytable <- table(data_f$bathroom_type)
b <- barplot(mytable,
        main = "Types of bathrooms",
        ylab = "Bathrooms",
        names.arg = names(mytable),
        ylim=c(0,4500)
        )
text(b, mytable+100, mytable, font=2)


##bedrooms
mytable <- table(data_f$rooms_count)
b2 <- barplot(mytable,
             main = "Number of rooms",
             ylab = "Rooms",
             names.arg = names(mytable),
             ylim=c(0,3000), col="green"
)
text(b2, mytable+100, mytable, font=2)


##price
h <- hist(data_f$price, main="Histogram for Sold Price", xlab="Sold Price, $", col="green", ylim=c(0,2000))
text(h$mids,h$counts,labels=h$counts, adj=c(0.5, -0.5))

## linear model
plot(price ~ area_full, data = data_f, col = "blue")
reg1 = lm(price ~ area_full, data=data_f)
reg1
summary(reg1)
abline(reg1, col="red")

plot(sold_price ~ bedrooms, data = data_f, col = "blue")
reg2 = lm(sold_price ~ bedrooms, data=data_f)
reg2
summary(reg2)
abline(reg2, col="red")


## miltiple model

regt = lm(price ~ district_id + rooms_count + floor + house_type_id + area_full + area_living + build_year + bathroom_type_id + remont_type_id, data = data_f)
summary(regt)

regt = lm(price ~ district_id + rooms_count + floor + house_type_id + area_full + area_living + build_year + remont_type_id, data = data_f)
summary(regt)

modified = data_f[, -c(1, 3, 7, 12, 14)]
M <- cor(modified)
library(corrplot)
corrplot(M, type = "upper", method = "number")


## multiple model rooms == 1
new_data_f = read.csv("1_room_properties.csv", header = TRUE)
regt = lm(price ~ district_id + floor + house_type_id + area_full + area_living + build_year + bathroom_type_id + remont_type_id, data = new_data_f)
summary(regt)

regt = lm(price ~ district_id  + area_full + area_living + build_year + bathroom_type_id + remont_type_id, data = new_data_f)
summary(regt)

modified = new_data_f[, -c(1, 3, 5, 7, 12, 14)]
M <- cor(modified)
corrplot(M, type = "upper", method = "number")

## multiple model bedrooms == 2
new_data_f = read.csv("2_room_properties.csv", header = TRUE)
regt = lm(price ~ district_id + floor + house_type_id + area_full + area_living + build_year + bathroom_type_id + remont_type_id, data = new_data_f)
summary(regt)


## multiple model bedrooms == 3
new_data_f = read.csv("3_room_properties.csv", header = TRUE)
regt = lm(price ~ district_id + floor + house_type_id + area_full + area_living + build_year + bathroom_type_id + remont_type_id, data = new_data_f)
summary(regt)

## multiple model bedrooms == 4
new_data_f = read.csv("4_room_properties.csv", header = TRUE)
regt = lm(price ~ district_id + floor + house_type_id + area_full + area_living + build_year + bathroom_type_id + remont_type_id, data = new_data_f)
summary(regt)

## multiple model rooms == 1, with interval
new_data_f = read.csv("1_room_properties_1.csv", header = TRUE)
regt = lm(price ~ district_id + floor + house_type_id + area_full + area_living + build_year + bathroom_type_id + remont_type_id, data = new_data_f)
summary(regt)

regt = lm(price ~ district_id + area_full + bathroom_type_id + remont_type_id, data = new_data_f)
summary(regt)


## multiple model with district
setwd("/home/dmitry/Documents/regression/parser/districts")
new_data_f = read.csv("filtered_properties_9.csv", header = TRUE)
regt = lm(price ~ rooms_count + floor + house_type_id + area_full + area_living + build_year + bathroom_type_id + remont_type_id, data = new_data_f)
summary(regt)


modified = new_data_f[, -c(1, 3, 5, 7, 12, 14)]
M <- cor(modified)
corrplot(M, type = "upper", method = "number")

# predict
predicted_vals = predict(regt, new_data_f)
plot(predicted_vals, new_data_f$price,
     xlab="predicted",ylab="actual")
abline(a=0,b=1)

predicted_vals
new_data_f$price

precision(new_data_f$price, predicted_vals)


