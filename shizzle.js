(function(){
    window.$ = window.shizzle = Shizzle;

    function Shizzle(selector){
        if(typeof selector != 'string') return new Error("Selctor must be a string!");
        var charArray = selector.trim().split('')
        ,   tokens = tokenize(charArray)
    }

    function tokenize(charArray){
        var currentChar = charArray[0]
        ,   currentSet
        ,   pos = 0
        ,   currentToken
        ,   next
        ,   tokens = [];

        while(currentChar){
            if(currentChar === "#"){
                currentToken = token("id");
                tokens.shift(currentToken); // The right most id gets pushed to the front as ids are unique
            }else if(currentChar === '.'){
                currentToken = token("class");
                tokens.push(currentToken);
            }else if(currentChar !== ' '){
                currentToken = token("element");
                tokens.push(currentToken);
            }
            next = charArray[pos++];
            while(next){
                currentToken.value += next;
                next = charArray[pos++];
            }
        }
    }

    function token(type){
        return {
            type : type,
            value : ''
        }
    }
}())