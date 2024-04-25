
class SearchAlgorithm {
    buildRegexConditions(fields, searchMessage) {
        return fields.map(field => ({
            [field]: { $in: searchMessage.map(substring => new RegExp(substring, 'i')) }
        }));
    }
    countMatchesForField(doc, field, searchMessage) {
        let count = 0;
        const fieldValue = doc[field];
        if (Array.isArray(fieldValue)) {
            count += fieldValue.filter(value => searchMessage.some(substring => value.toLowerCase().includes(substring.toLowerCase()))).length;
        } else {
            count += searchMessage.filter(substring => new RegExp(substring, 'i').test(fieldValue)).length;
        }
        return count;
    }
    async searchData(req, res, collection) {
        console.log("you are inside the search")
        let { message, currentPage, perPage } = req.body;
        console.log(message, currentPage, perPage)
        let searchMessage = message
        if (searchMessage === 'search') {
            console.log(searchMessage)
            const responses = await collection.find({ approve: 1 }).skip((currentPage - 1) * perPage).limit(perPage).toArray()
            const count = await collection.countDocuments({ approve: 1 });
            res.json({ datavalue: responses, totalCount: count });
        } else {
            // Convert to array if it's a string
            if (typeof searchMessage === 'string') {
                searchMessage = searchMessage.split(' ');
            }

            const fieldsToSearch = ['TranslatedRecipeName', 'Cuisine', 'Course', 'Diet']; // Add more fields as needed
            const orConditions = this.buildRegexConditions(fieldsToSearch, searchMessage);

            const count = await collection.countDocuments({
                $or: orConditions, approve: 1
            });
            const searchResult = await collection.find({
                $or: orConditions, approve: 1
            }).toArray();

            // Sort the search results based on the number of matches
            searchResult.sort((a, b) => {
                const matchesA = countMatches(a);
                const matchesB = countMatches(b);
                return matchesB - matchesA;
            });

            function countMatches(doc) {
                let count = 0;
                for (const field of Object.values(doc)) {
                    if (Array.isArray(field)) {
                        count += field.filter(value => searchMessage.some(substring => value.toLowerCase().includes(substring.toLowerCase()))).length;
                    } else {
                        count += searchMessage.filter(substring => new RegExp(substring, 'i').test(field)).length;
                    }
                }
                return count;
            }
            // Move the recipes with more matches in 'TranslatedRecipeName' to the top
            searchResult.sort((a, b) => {
                const matchesA = this.countMatchesForField(a, 'TranslatedRecipeName', searchMessage);
                const matchesB = this.countMatchesForField(b, 'TranslatedRecipeName', searchMessage);
                return matchesB - matchesA;
            });
            const responses1 = searchResult.slice((currentPage - 1) * perPage, ((currentPage - 1) * perPage) + perPage).map((a) => {
                return a;
            });
            res.json({ datavalue: responses1, totalCount: count });
        }
    }
}


let obj = new SearchAlgorithm()
module.exports = obj